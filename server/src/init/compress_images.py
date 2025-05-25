import os
from PIL import Image
import sys

def compress_and_resize_images(input_folder, output_folder, max_width=900):
    # Check if the output folder exists, if not, create it
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        print(f"Created output folder: {output_folder}")

    # Loop through all files in the specified input folder
    for filename in os.listdir(input_folder):
        # Get the full path of the file
        file_path = os.path.join(input_folder, filename)
        
        # Check if it's a file and has an image extension
        if os.path.isfile(file_path) and filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            try:
                with Image.open(file_path) as img:
                    # Get the original dimensions
                    width, height = img.size
                    
                    # Calculate the new height to maintain aspect ratio
                    if width > max_width:
                        ratio = max_width / width
                        new_height = int(height * ratio)
                        img = img.resize((max_width, new_height), Image.LANCZOS)  # Use LANCZOS for high-quality downsampling
                    
                    # Save the compressed image to the output folder
                    output_path = os.path.join(output_folder, filename)
                    img.save(output_path, optimize=True, quality=85)  # Adjust quality as needed
                    print(f"Compressed and resized: {filename} to {output_path}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python compress_images.py <input_folder> <output_folder>")
        sys.exit(1)
    
    input_folder = sys.argv[1]
    output_folder = sys.argv[2]
    
    compress_and_resize_images(input_folder, output_folder)