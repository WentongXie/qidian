import os
import re
from pathlib import Path
import logging


def ydls(name: str) -> int:
    match = re.compile(r"第\s*(\d+)\s*章").search(name)
    if match:
        return int(match.group(1))
    return float('inf')


def ydmms(name: str) -> int:
    match = re.compile(r"\s*(\d+)\s*、").search(name)
    if match:
        return int(match.group(1))
    return float('inf')


def common(name: str) -> int:
    match = re.compile(r"_(\d+)_").search(name)
    if match:
        return int(match.group(1))
    return float('inf')

def get_chapter_title(file_path: str, folder: str) -> str:
    match = re.compile(r"_\d+_(.+)\s_《").search(file_path)
    ret = match.group(1)
    return ret.strip()


def merge_txt_files(folder: str, output_file: str, sort_func: function) -> None:
    folder_path = Path(folder)
    if not folder_path.is_dir():
        raise FileNotFoundError(f"Folder not found: {folder}")

    txt_files = [p for p in folder_path.iterdir() if p.is_file()
                 and p.suffix.lower() == '.txt']
    if not txt_files:
        raise FileNotFoundError(f"No txt files found in folder: {folder}")

    txt_files.sort(key=lambda p: (sort_func(p.stem), p.stem))

    with open(output_file, 'w', encoding='utf-8') as out_file:
        for file_path in txt_files:
            with open(file_path, 'r', encoding='utf-8') as in_file:
                chapter_title = get_chapter_title(file_path.stem, folder)
                out_file.write(chapter_title + '\n')
                out_file.write(in_file.read().replace("\n\n", "\n"))
                out_file.write('\n')


def main():
    logging.basicConfig(level=logging.INFO)
    merge_txt_files("剑烛大荒", "剑烛大荒.txt", common)
    pass


if __name__ == '__main__':
    main()
