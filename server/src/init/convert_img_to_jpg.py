import os
from PIL import Image
import sys

def convert_images_to_jpg(folder_path):
    # Define the output folder
    output_folder = os.path.join(folder_path, "cooked")
    
    # Check if the output folder exists, if not, create it
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        print(f"Created output folder: {output_folder}")

    # Loop through all files in the specified folder
    for filename in os.listdir(folder_path):
        # Get the full path of the file
        file_path = os.path.join(folder_path, filename)
        
        # Check if it's a file and has an image extension
        if os.path.isfile(file_path):
            # Split the filename and extension
            name, ext = os.path.splitext(filename)
            ext = ext.lower()  # Convert extension to lowercase
            
            # Define the new filename with .jpg extension
            new_filename = f"{name}.jpg"
            new_file_path = os.path.join(output_folder, new_filename)
            
            # Open the image and convert it to RGB (if necessary)
            try:
                with Image.open(file_path) as img:
                    img = img.convert("RGB")  # Convert to RGB
                    img.save(new_file_path, "JPEG")  # Save as JPEG
                    print(f"Converted: {filename} to {new_filename}")
                    
                    # Delete the original file after successful conversion
                    os.remove(file_path)
                    print(f"Deleted original file: {filename}")
            except Exception as e:
                print(f"Error converting {filename}: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python convert_img_to_jpg.py <folder_path>")
        sys.exit(1)
    
    folder_path = sys.argv[1]
    convert_images_to_jpg(folder_path)