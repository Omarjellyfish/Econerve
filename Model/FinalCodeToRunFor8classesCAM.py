import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import serial
import time

# Load trained model
model_path = "model_4_82.h5"
model = load_model(model_path)
# Updated class labels (new 8 classes)
###هتتغير على حسب ترتيب الداتا في لاب خوخ
class_labels = {
    0: 'glass',
    1: 'metal',
    2: 'other',
    3: 'paper',
    4: 'plastic',
    5: 'cardboard',
    6: 'battery',
    7: 'shoes',
    8: 'clothes'
}

# Mapping function to send the same number for specific classes
def map_class_to_arduino(predicted_class):
    #هتتعدل حسب الديكشنري اللي فوق
    if predicted_class in [5, 6, 7, 8]:  # Map cardboard, battery, shoes, clothes to a common number
        return 6  # Example: Send "6" to Arduino for these four classes
    else:
        return predicted_class + 1  # Keep other classes as before

try:cap = cv2.VideoCapture(0)  # Try 0 if 1 doesn't work
if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

# Warm-up the camera (read a few frames)
for _ in range(10):
    ret, _ = cap.read()
    if not ret:
        print("Error: Failed to initialize camera.")
        cap.release()
        exit()

# Open the serial port
try:
    ser = serial.Serial('COM3', 115200, timeout=1)  # Match with Arduino's port
    time.sleep(2)  # Allow time for connection
except serial.SerialException:
    print("Error: Could not open serial port.")
    cap.release()
    exit()

try:
    while True:
        # Show live feed while waiting for sensor signal
        ret, frame = cap.read()
        if ret:
            cv2.imshow("Live Feed", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break  # Press 'q' to quit the script

        if ser.in_waiting > 0:
            arduino_signal = ser.readline().decode().strip()

            if arduino_signal == "STOPPED":  # Object detected
                print("[INFO] Object detected. Capturing image...")

                # Capture image
                ret, frame = cap.read()
                if not ret:
                    print("Error: Failed to capture image.")
                    break

                # Preprocess the image
                image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  # Convert to RGB
                image = Image.fromarray(image)
                image = image.resize((224, 224))  # Resize for model
                image = img_to_array(image) / 255.0  # Normalize
                image = np.expand_dims(image, axis=0)  # Add batch dimension

                # Classify the image
                predictions = model.predict(image)
                predicted_class = np.argmax(predictions)
                confidence = np.max(predictions) * 100
                label = f"{class_labels[predicted_class]} ({confidence:.2f}%)"

                # Map the predicted class to the correct Arduino number
                arduino_output = map_class_to_arduino(predicted_class)

                ser.write(f"{arduino_output}\n".encode())  # Send to Arduino
                print(f"[INFO] Sent to Arduino: {arduino_output}")

                # Overlay classification result on the image
                cv2.putText(frame, label, (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

                # Show the classified image
                cv2.imshow("Classified Image", frame)
                cv2.waitKey(3000)  # Wait for 3 seconds
                cv2.destroyWindow("Classified Image")
                cv2.imwrite("captured_image.jpg", frame)

                print(f"[INFO] Classification: {label}")

                # Wait for conveyor movement
                print("[INFO] Waiting for conveyor to move...")
                time.sleep(6)  # Adjust based on conveyor speed

                # Flush serial buffer to avoid duplicate detection
                ser.reset_input_buffer()

except KeyboardInterrupt:
    print("\n[INFO] Stopping script...")



# Release resources
cap.release()
cv2.destroyAllWindows()
ser.close()