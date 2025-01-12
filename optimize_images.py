import os
from PIL import Image
import argparse


def resize_image(img, max_size=512):
    """
    Resize the image to a maximum of `max_size` pixels in width or height,
    while maintaining the aspect ratio.
    """
    width, height = img.size
    if width > max_size:
        new_width = max_size
        new_height = int(height * (max_size / width))
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    return img


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
                    # Resize the image if it's larger than 512 pixels
                    img = resize_image(img, max_size=512)

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
    # Set up argument parsing
    parser = argparse.ArgumentParser(
        description="Optimize and convert images to WebP format."
    )
    parser.add_argument(
        "input_folder", help="Path to the folder containing the images to process."
    )
    parser.add_argument(
        "output_folder",
        help="Path to the folder where the optimized images will be saved.",
    )

    args = parser.parse_args()

    # Call the optimize_images function with specified paths
    optimize_images(args.input_folder, args.output_folder)
