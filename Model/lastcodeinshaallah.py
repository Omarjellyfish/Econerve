import cv2
import serial
import time
import numpy as np
from PIL import Image
from rembg import remove
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.models import load_model

# Load trained model
model = load_model(r"C:\Users\ameer\Downloads\resnet50_model.h5")

# Class labels and bin mapping
class_labels = {
    0: 'battery',
    1: 'cardboard',
    2: 'clothes',
    3: 'glass',
    4: 'metal',
    5: 'paper',
    6: 'plastic',
    7: 'shoes'
}

category_to_bin = {
    'plastic': 1,
    'paper': 2,
    'glass': 3,
    'metal': 4,
    'battery': 5,
    'cardboard': 5,
    'clothes': 5,
    'shoes': 5
}

# Serial connection to Arduino
arduino = serial.Serial('COM3', 9600)
time.sleep(2)  # Wait for connection to initialize

# Initialize Camera
cap = cv2.VideoCapture(0)

# Current bin section (start at section 1)
current_section = 1

def preprocess_frame(frame):
    """ Preprocess captured frame similar to training data """
    img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)).convert("RGBA")

    # Remove background
    img_no_bg = remove(img)

    # Add white background
    white_bg = Image.new("RGBA", img_no_bg.size, (255, 255, 255, 255))
    img_with_white_bg = Image.alpha_composite(white_bg, img_no_bg).convert("RGB")

    # Resize to 224x224
    img_resized = img_with_white_bg.resize((224, 224))

    # Convert to numpy array
    img_array = np.array(img_resized)

    # Preprocess for ResNet50
    img_array = preprocess_input(img_array)

    return np.expand_dims(img_array, axis=0)

def calculate_steps(current, target):
    """ Calculate how many steps to move from current to target section """
    if target == current:
        return 0

    return (target - current) % 5

print("✅ System ready — waiting for ultrasonic trigger...")

try:
    while True:
        # Read from Arduino
        if arduino.in_waiting > 0:
            data = arduino.readline().decode().strip()
            if data == 'TRIGGER':
                print("📸 Object detected — capturing image...")

                # Capture frame
                ret, frame = cap.read()
                if not ret:
                    print("⚠️ Failed to capture image.")
                    continue

                # Preprocess image
                preprocessed_img = preprocess_frame(frame)

                # Predict class
                prediction = model.predict(preprocessed_img)
                predicted_class_idx = np.argmax(prediction)
                confidence = prediction[0][predicted_class_idx] * 100
                predicted_label = class_labels[predicted_class_idx]
                target_section = category_to_bin[predicted_label]

                # Show image and result
                display_frame = frame.copy()
                cv2.putText(display_frame, f"{predicted_label.upper()} ({confidence:.2f}%)",
                            (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)
                cv2.imshow("Garbage Classification", display_frame)
                cv2.waitKey(500)  # Show for half a second

                # Calculate bin steps
                steps = calculate_steps(current_section, target_section)
                print(f"🗑️ Move bin from section {current_section} to {target_section} ({steps} steps)")

                # Send to Arduino
                arduino.write(f"{steps}\n".encode())

                # Update current section
                current_section = target_section

                print("✅ Classification and rotation done.\n")

        # Break with 'q' key
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

except KeyboardInterrupt:
    print("🛑 System stopped manually.")

finally:
    cap.release()
    cv2.destroyAllWindows()
    arduino.close()


#####################################
# import cv2
# import numpy as np
# from PIL import Image
# from rembg import remove
# import tensorflow as tf
#
# # Load your trained model
# model = tf.keras.models.load_model(r"C:\Users\ameer\Downloads\resnet50_model.h5", compile=False)
#
# # Class labels and bin section mapping
# class_labels = {
#     0: 'battery',
#     1: 'cardboard',
#     2: 'clothes',
#     3: 'glass',
#     4: 'metal',
#     5: 'paper',
#     6: 'plastic',
#     7: 'shoes'
# }
#
# bin_mapping = {
#     'plastic': 1,
#     'paper': 2,
#     'glass': 3,
#     'metal': 4,
#     'other': 5
# }
#
#
# # Function to map model class to bin category
# def map_class_to_bin(predicted_class):
#     label = class_labels[predicted_class]
#     if label in ['plastic']:
#         return 'plastic'
#     elif label in ['paper']:
#         return 'paper'
#     elif label in ['glass']:
#         return 'glass'
#     elif label in ['metal']:
#         return 'metal'
#     else:
#         return 'other'
#
#
# # Preprocess function
# def preprocess_image(frame):
#     # Convert to PIL Image
#     img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)).convert("RGBA")
#
#     # Remove background
#     img_no_bg = remove(img)
#
#     # Add white background
#     white_bg = Image.new("RGBA", img_no_bg.size, (255, 255, 255, 255))
#     img_with_white_bg = Image.alpha_composite(white_bg, img_no_bg).convert("RGB")
#
#     # Resize and convert to numpy array
#     img_resized = img_with_white_bg.resize((224, 224))
#     img_array = np.array(img_resized)
#
#     # Preprocess for ResNet50
#     img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
#     img_array = np.expand_dims(img_array, axis=0)
#
#     return img_array, img_resized
#
#
# # Simulate current bin position
# current_bin_position = 1  # Starting at bin 1
#
# # Open webcam
# cap = cv2.VideoCapture(0)  # 0 is usually your main camera
#
# if not cap.isOpened():
#     print("⚠️ Could not open webcam.")
#     exit()
#
# print("\n✅ System ready — Press Enter to simulate ultrasonic detection. Press q to quit.\n")
#
# while True:
#     ret, frame = cap.read()
#     if not ret:
#         print("Failed to capture image")
#         break
#
#     # Show the live feed
#     cv2.imshow("Live Feed", frame)
#
#     key = cv2.waitKey(1) & 0xFF
#     if key == ord('q'):
#         break
#     elif key == 13:  # Enter key (simulate ultrasonic detection)
#         print("\n🔍 Ultrasonic sensor detected an object!")
#
#         img_array, img_processed = preprocess_image(frame)
#
#         # Predict with model
#         preds = model.predict(img_array)
#         predicted_class = np.argmax(preds)
#         confidence = preds[0][predicted_class] * 100
#
#         predicted_bin_category = map_class_to_bin(predicted_class)
#         target_bin_position = bin_mapping[predicted_bin_category]
#
#         # Calculate rotations
#         rotations_needed = (target_bin_position - current_bin_position) % 5
#         if rotations_needed == 0:
#             rotations_needed = 5
#
#         print(f"📸 Predicted Class: {class_labels[predicted_class]}")
#         print(f"🗑️  Mapped Bin Category: {predicted_bin_category}")
#         print(f"✅ Prediction Confidence: {confidence:.2f}%")
#         print(f"🔄 Current Bin Position: {current_bin_position}")
#         print(f"➡️  Target Bin Position: {target_bin_position}")
#         print(f"↩️  Rotations Needed: {rotations_needed}")
#
#         # Update current position
#         current_bin_position = target_bin_position
#
# print("Exiting...")
# cap.release()
# cv2.destroyAllWindows()
