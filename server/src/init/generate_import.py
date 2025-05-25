import os, sys

def generate_image_imports(folder_path):
    # List to hold the import statements
    imports = []
    
    # Loop through all files in the specified folder
    for filename in os.listdir(folder_path):
        # Check if the file is an image
        if filename.endswith(('.jpg', '.jpeg', '.png', '.svg')):
            # Create the import statement
            import_statement = f'import {filename[:-4]} from "{folder_path}/{filename}";'
            imports.append(import_statement)
    
    # Create the array of images
    image_array = 'const imageList = [\n    ' + ',\n    '.join([filename[:-4] for filename in os.listdir(folder_path) if filename.endswith(('.jpg', '.jpeg', '.png', '.svg'))]) + '\n];\n'
    
    # Combine the imports and the array
    output = '\n'.join(imports) + '\n\n' + image_array + '\nexport default imageList;'
    
    return output

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python generate_import.py <folder_path>")
        sys.exit(1)

    result = generate_image_imports(sys.argv[1])
    
    # Save the output to a file
    with open('imageList.tsx', 'w') as f:
        f.write(result)
    
    print("imageList.tsx has been generated.")