import json
import random
import string
import sys

def generate_random_name():
    """Generate a random 9-character string starting with a letter (a-z) followed by letters and numbers."""
    first_character = random.choice(string.ascii_lowercase)  # Random character between 'a' and 'z'
    remaining_characters = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(8))
    return first_character + remaining_characters

def add_random_names(input_file, output_file):
    # Read the input JSON file
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    # Keep track of used names to ensure uniqueness
    used_names = set()
    
    # Add random names to each object
    for obj in data:
        while True:
            random_name = generate_random_name()
            if random_name not in used_names:
                obj['name'] = random_name
                used_names.add(random_name)
                break
    
    # Write the modified data to the output file
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python add_random_names.py input.json output.json")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    try:
        add_random_names(input_file, output_file)
        print(f"Successfully added random names to objects. Output written to {output_file}")
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1) 