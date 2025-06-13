import os

def convert_to_js_structure(filenames, output_file):
    quoted_filenames = [f'"{name}"' for name in filenames]
    js_structure = f"const cards = [{','.join(quoted_filenames)}];\n"
    
    # Write to file
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(js_structure)
    
    return js_structure

def get_all_jpg_files(root_dir="."):
    jpg_files = []
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.lower().endswith(".jpg"):
                rel_path = os.path.relpath(os.path.join(dirpath, filename), root_dir).replace("\\", "/")
                jpg_files.append(f"{rel_path}")
    return jpg_files

# Get all .jpg file names recursively
jpg_files = get_all_jpg_files()

# Run the function and get the output
result = convert_to_js_structure(jpg_files, "_Output.txt")

# Print the result
print(result)

# Pause the script
input("Press Enter to exit...")
