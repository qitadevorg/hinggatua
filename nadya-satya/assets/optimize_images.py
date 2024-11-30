import os
from PIL import Image


def optimize_images(input_folder, output_folder):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Supported image extensions
    valid_extensions = (".png", ".jpg", ".jpeg")

    # Iterate through all files in the input folder
    for filename in os.listdir(input_folder):
        if filename.lower().endswith(valid_extensions):
            input_path = os.path.join(input_folder, filename)

            # Construct the output filename with original extension
            output_filename = f"{filename}.webp"
            output_path = os.path.join(output_folder, output_filename)

            try:
                # Open the image file
                with Image.open(input_path) as img:
                    # Handle transparency for PNGs
                    if img.mode in ("RGBA", "LA") or (
                        img.mode == "P" and "transparency" in img.info
                    ):
                        img = img.convert("RGBA")  # Preserve alpha transparency
                        img.save(
                            output_path, "webp", lossless=True
                        )  # Use lossless for transparent images
                    else:
                        img = img.convert("RGB")  # For non-transparent images
                        img.save(output_path, "webp", optimize=True, quality=85)

                    print(f"Optimized and converted: {filename} -> {output_filename}")
            except Exception as e:
                print(f"Failed to process {filename}: {e}")


if __name__ == "__main__":
    current_folder = os.getcwd()
    optimized_folder = os.path.join(current_folder, "optimized")
    optimize_images(current_folder, optimized_folder)
