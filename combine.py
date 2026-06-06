import os
import re
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
CHAPTER_PATTERN = re.compile(r"第\s*(\d+)\s*章")


def extract_chapter_number(name: str) -> int:
    match = CHAPTER_PATTERN.search(name)
    if match:
        return int(match.group(1))
    return float('inf')


def merge_txt_files(folder: str, output_file: str) -> None:
    folder_path = Path(folder)
    if not folder_path.is_dir():
        raise FileNotFoundError(f"Folder not found: {folder}")

    txt_files = [p for p in folder_path.iterdir() if p.is_file()
                 and p.suffix.lower() == '.txt']
    if not txt_files:
        raise FileNotFoundError(f"No txt files found in folder: {folder}")

    txt_files.sort(key=lambda p: (extract_chapter_number(p.stem), p.stem))

    with open(output_file, 'w', encoding='utf-8') as out_file:
        for file_path in txt_files:
            with open(file_path, 'r', encoding='utf-8') as in_file:
                _, filename = os.path.split(file_path)
                chapter_title = os.path.splitext(filename)[0]
                out_file.write(chapter_title + '\n')
                out_file.write(in_file.read().replace("\n\n", "\n"))
                out_file.write('\n')


def main():
    merge_txt_files("异度旅社", "异度旅社.txt")
    pass


if __name__ == '__main__':
    main()
