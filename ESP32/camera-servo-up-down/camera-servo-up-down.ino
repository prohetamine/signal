#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <pwmWrite.h>

#define SERVO_PIN 16
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914f"
#define CHARACTERISTIC_SIGNAL_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a7"

BLEServer* pServer = NULL;
BLECharacteristic* pSignalCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;

Pwm pwm = Pwm();

float angle = 90; // Dafault servo angle
int maxAngle = angle + 50; // Max servo angle
int minAngle = angle - 50; // Max servo angle

class ServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
  };

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
  }
};

void setup() {
  Serial.begin(115200);

  pwm.writeServo(SERVO_PIN, angle);

  BLEDevice::init("CamSi");

  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);

  pSignalCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_SIGNAL_UUID,
    BLECharacteristic::PROPERTY_WRITE
  );

  pSignalCharacteristic->addDescriptor(new BLE2902());

  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);
  BLEDevice::startAdvertising();
  Serial.println("Waiting a client connection to notify...");
}

void loop() {
  if (deviceConnected) {
    std::string signalData = pSignalCharacteristic->getValue();
    String normalizeData = signalData.c_str();
    if (normalizeData != "") {
      String nameSignals[10] = {"", ""};
      String signals[10] = {"", ""};

      int commaCount = 0;
      bool dots = false;

      String name = "";
      String value = "";

      for (int x = 0; x < normalizeData.length(); x++) {
        char symbol = normalizeData[x];

        if (String(symbol) == ":") {
          dots = true;
        }

        if (String(symbol) == ",") {
          dots = false;
        }

        if (String(symbol) != ":" && String(symbol) != ",") {
          if (dots) {
            value += String(symbol);
          } else {
            name += String(symbol);
          }
        }

        if (String(symbol) == ",") {
          nameSignals[commaCount] = name;
          signals[commaCount] = value;

          name = "";
          value = "";
          commaCount++;
        }
      }

      if (
        !(
          nameSignals[0] == "Up" &&
          nameSignals[1] == "Down" &&
          signals[0] == "true" &&
          signals[1] == "true"
        )
      ) {
        for (int x = 0; x < 2; x++) {
          if (nameSignals[x] == "Up" && signals[x] == "true") {
            if (angle > minAngle) {
              angle -= 0.05;
              Serial.println(angle);
              pwm.writeServo(SERVO_PIN, angle);
            }
          }

          if (nameSignals[x] == "Down" && signals[x] == "true") {
            if (angle < maxAngle) {
              angle += 0.05;
              Serial.println(angle);
              pwm.writeServo(SERVO_PIN, angle);
            }
          }
        }
      }
    }
    delay(30);
  }

  if (!deviceConnected && oldDeviceConnected) {
    delay(500);
    pServer->startAdvertising();
    oldDeviceConnected = deviceConnected;
  }

  if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
  }
}
