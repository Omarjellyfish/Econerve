import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.resnet50 import preprocess_input
from flask import Flask, render_template, request, redirect, url_for
import os

# Initialize the Flask app
app = Flask(__name__)

# Load the trained model
model = load_model("resnet50_model.h5")

# Class labels
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

# Function to preprocess the image
def preprocess_image(image_path):
    # Load image
    img = Image.open(image_path).convert("RGB")

    # Resize to 224x224 (ResNet50 input size)
    img_resized = img.resize((224, 224))

    # Convert to numpy array
    img_array = np.array(img_resized)

    # Preprocess for ResNet50
    img_array = preprocess_input(img_array)

    return np.expand_dims(img_array, axis=0)

# Function to predict the class of the uploaded image
def predict_image(image_path):
    # Preprocess the image
    preprocessed_img = preprocess_image(image_path)

    # Predict class
    prediction = model.predict(preprocessed_img)
    predicted_class_idx = np.argmax(prediction)
    predicted_label = class_labels[predicted_class_idx]

    return predicted_label

# Route to display the form and handle image uploads
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Get the uploaded file
        file = request.files["file"]
        
        # Create the 'static/uploads' folder if it doesn't exist
        if not os.path.exists("static/uploads"):
            os.makedirs("static/uploads")

        # Save the file to the 'static/uploads' folder
        file_path = os.path.join("static/uploads", file.filename)
        file.save(file_path)

        # Get the predicted label
        predicted_label = predict_image(file_path)

        # Generate image URL to display it in the template
        image_url = url_for("static", filename=f"uploads/{file.filename}")

        # Render the result
        return render_template("index.html", prediction=predicted_label, image_url=image_url)
    
    return render_template("index.html", prediction=None)

if __name__ == "__main__":
    app.run(debug=True)
