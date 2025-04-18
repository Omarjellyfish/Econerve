import os
import numpy as np
import tensorflow as tf
from PIL import Image
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.utils import class_weight
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report

# Configuration
dataset_path = r"C:\Users\ahmed\Desktop\python\grad\newDataset"

# Load and preprocess data
def load_data(folder_path):
    images = []
    labels = []
    class_names = sorted(os.listdir(folder_path))
    
    for label, class_name in enumerate(class_names):
        class_folder = os.path.join(folder_path, class_name)
        for img_file in os.listdir(class_folder):
            if img_file.lower().endswith(('.jpg', '.jpeg', '.png')):
                img_path = os.path.join(class_folder, img_file)
                try:
                    img = Image.open(img_path)
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    img = img.resize((224, 224))
                    images.append(np.array(img))
                    labels.append(label)
                    img.close()
                except:
                    print(f"⚠️ Skipping invalid image: {img_path}")
    
    return np.array(images), np.array(labels)

# Load and split data
images, labels = load_data(dataset_path)
X_train, X_val, y_train, y_val = train_test_split(images, labels, test_size=0.2, random_state=42)

# Handle class imbalance
class_weights = class_weight.compute_class_weight(
    'balanced', classes=np.unique(y_train), y=y_train
)
class_weights = {i: weight for i, weight in enumerate(class_weights)}

# Data augmentation with ResNet preprocessing
train_datagen = ImageDataGenerator(
    preprocessing_function=tf.keras.applications.resnet50.preprocess_input,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True
)

val_datagen = ImageDataGenerator(
    preprocessing_function=tf.keras.applications.resnet50.preprocess_input
)

train_generator = train_datagen.flow(X_train, y_train, batch_size=16)
val_generator = val_datagen.flow(X_val, y_val, batch_size=16, shuffle=False)

# Build ResNet50 model
def create_model():
    base = tf.keras.applications.ResNet50(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    base.trainable = False
    
    model = tf.keras.Sequential([
        base,
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dense(256, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(8, activation='softmax')
    ])
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-4),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

# Train model
model = create_model()
model.summary()


history = model.fit(
    train_generator,
    epochs=25,
    validation_data=val_generator,
    class_weight=class_weights,
    callbacks=[
        tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True)
    ]
)

# Save model with clean weights
def save_model_safe(model, filename):
    # Create a fresh model instance
    clean_model = create_model()
    clean_model.set_weights(model.get_weights())
    
    # Convert all variables to numpy arrays
    for layer in clean_model.layers:
        if hasattr(layer, 'kernel'):
            layer.kernel.assign(tf.cast(layer.kernel, tf.float32).numpy())
        if hasattr(layer, 'bias') and layer.bias is not None:
            layer.bias.assign(tf.cast(layer.bias, tf.float32).numpy())
    
    # Save in HDF5 format
    clean_model.save(filename, include_optimizer=False)

save_model_safe(model, 'resnet50_model.h5')

# Final evaluation
loss, accuracy = model.evaluate(val_generator)
print(f"Loss: {loss}, Accuracy: {accuracy}")

# Generate predictions
y_pred = model.predict(val_generator)
y_pred_classes = np.argmax(y_pred, axis=1)

# Confusion Matrix
cm = confusion_matrix(y_val, y_pred_classes)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=sorted(os.listdir(dataset_path)),
            yticklabels=sorted(os.listdir(dataset_path)))
plt.xlabel("Predicted Label")
plt.ylabel("True Label")
plt.title("Confusion Matrix")
plt.show()

# Classification Report
print("\nClassification Report:")
print(classification_report(y_val, y_pred_classes))