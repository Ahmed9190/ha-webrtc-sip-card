#!/bin/bash

# Configuration
IGNORE_FILE="ignore_objects.txt"
RESTORED_FILE="restored_files.txt"
TEMP_FILE="object_dates.tmp"

# Clear the output files
> "$TEMP_FILE"
> "$RESTORED_FILE"

# Function to check if object should be ignored
is_ignored() {
    local obj_id="$1"

    if [ -f "$IGNORE_FILE" ]; then
        # Check if object ID is in ignore file (not commented out)
        if grep -q "^$obj_id$" "$IGNORE_FILE" 2>/dev/null; then
            return 0  # Object should be ignored
        fi
    fi
    return 1  # Object should not be ignored
}

# Function to load ignore list
load_ignore_list() {
    if [ -f "$IGNORE_FILE" ]; then
        echo "Loading ignore list from $IGNORE_FILE..."
        ignored_count=$(grep -v '^#' "$IGNORE_FILE" | grep -v '^$' | wc -l)
        echo "Found $ignored_count objects to ignore"
        echo ""
    else
        echo "No ignore file found. Processing all objects."
        echo ""
    fi
}

echo "Git Object Recovery with Ignore List Support"
echo "==========================================="
echo ""

load_ignore_list

# Method to get object creation time from .git directory
get_object_file_date() {
    local obj_id="$1"
    local obj_dir="${obj_id:0:2}"
    local obj_file="${obj_id:2}"
    local obj_path=".git/objects/$obj_dir/$obj_file"

    if [ -f "$obj_path" ]; then
        # Get file modification time
        stat -c %Y "$obj_path" 2>/dev/null || stat -f %m "$obj_path" 2>/dev/null
    else
        echo "0"
    fi
}

# Counters
processed_count=0
ignored_count=0
total_objects=53

# Build array with dates and object IDs (excluding ignored ones)
for obj_id in "01ee994722e361d8c2e8176d25862131b512b5de" "85b15c3cba7361d4165391701879778fa23e1983" "8575fcf19aae97c7a196e271aa7a9205629c3d77" "0c463f5a8eab89d43018c158aa253f543c444ead" "8c651b0790a72dc26bcf3ac939691b1896e95b83" "0fd8b0ad49cd10808e56e2fd332970776d277fd8" "11f02fe2a0061d6e6e1f271b21da95423b448b32" "928f74716507e1346f344278f53d84c10265ed4b" "9351024f58df05c1281e1e9f327f273a88553ceb" "9aed54c35b12f5e8cec1ea5f3d26d406163b172b" "9b43dde56f05001927d3083a1589a731466c6359" "1dd53e6be429256511e8d77579ec0450f90ed306" "9edb7f2c88a22b1da2db028024e7c85cae88b31a" "2384673b63e2ae01d414c771632b5139f950555a" "a547bf36d8d11a4f89c59c144f24795749086dd1" "2634cf9204db9290f50a7af2ca32bee1fe2671bb" "295155e8bafa93a5e8a85c131e174e5ff472d725" "adac3e2e9e3a0356c33690b6643e2ca04d84c771" "ae2f332969d290e8701998981441e9c0d6c3ea4f" "b1801e2a04d452ba510d5bbc93cde4b265690131" "38b587e2f626366eee46509eb9ad695b6b358bfc" "b994975a7e96f201f20e9113eaaae40f6233b1dd" "3ade8726adef8ecf182b04207d69b18f94eba0cc" "c1145b1516f3323142a3c94459fa789b943e02ce" "43c20c10f881bcda055b94c23efe2f0777544337" "c68eaa5d10d9b6c6ff1d1649246c78b73eb8be8c" "4715d03c5c00e6808e4fa63e1a2f2526fe77877e" "c8225a70fdd478a1c887f6ce68931df05209e6d5" "caba67c4f84acf5a2350c9d0357a172ee6c0d5cb" "cce888cd1328552109bec0b0e681fe07894410c2" "d3d7948ed817791f1f6250a329f616eb76c914e2" "d403a194b02a1637f273718d6be2b6f28130d1da" "d753852faccec2ba5c7c4ca26b2c9fa9b4df42ef" "d82e5946448c9d216055d23dfa139eaadc491f3c" "6179d941a2a8a7ec99990675a1677c043f13ab52" "e1d15dea70f54389114a64627b4f3cfda7fd9d2a" "e5596d32b9c276cd6a2505fe0726011722785606" "676d8aadc36aeb751e2d5d13f5bd64a991cf1e01" "e723d8c55c1b3ea111dfcdea68db6d62d7e6ba14" "ea333aafd21896bff9f4f47ccb822c7fd6da027d" "6c3a0b028bf3147743f541a85ac3e1cdc77d520a" "6c8b67f94a29783b844aa61ac699210d5e530709" "ec4f9cd3ba5da110ac657467bd6a5adeb94ad4de" "ec7d6bfd281fe52e7a938345f204341ee962e38b" "709be8b98c3af0226e5d5df622a49a3ef1b576ee" "704d6f0bf6297718578fb7f87b83ed909d5cfaf6" "703d9f10fa11fdf366fd2bbde87c97b507b6b0c2" "f1ba95c2e18fe15d521c7045ffdd4ccdf92ebe87" "77112136d869f4e2759db6a7d6407cdeeef974a5" "f997d639fea7c72cba7e63e1abf25e2bced4cd7a" "7c640ef577b642ec92384f4eadfdc77ffa8e28f2" "7c80500a885c0003c3401120e6185abe5fa7aafb" "7c106f17da06ff913cd84e4d510e38ba8faeae29"; do

    # Check if this object should be ignored
    if is_ignored "$obj_id"; then
        echo "Ignoring: $obj_id"
        ((ignored_count++))
        continue
    fi

    echo -n "Processing $obj_id... "

    # Get object type
    obj_type=$(git cat-file -t "$obj_id" 2>/dev/null || echo "unknown")

    # Get file system date
    fs_timestamp=$(get_object_file_date "$obj_id")

    # Convert timestamp to readable date
    if [ "$fs_timestamp" != "0" ] && [ -n "$fs_timestamp" ]; then
        readable_date=$(date -d @"$fs_timestamp" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || date -r "$fs_timestamp" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "unknown")
    else
        readable_date="unknown"
    fi

    # Store in format: timestamp|readable_date|object_id|type
    echo "${fs_timestamp}|${readable_date}|${obj_id}|${obj_type}" >> "$TEMP_FILE"
    echo "$readable_date ($obj_type)"
    ((processed_count++))
done

echo ""
echo "Summary:"
echo "- Total objects: $total_objects"
echo "- Processed: $processed_count"
echo "- Ignored: $ignored_count"
echo ""
echo "Sorting objects by date (newest first)..."

# Sort by timestamp (newest first) and process
sort -nr -t'|' -k1 "$TEMP_FILE" | while IFS='|' read -r timestamp readable_date obj_id obj_type; do
    echo "=== Object: $obj_id | Date: $readable_date | Type: $obj_type ===" >> "$RESTORED_FILE"
    echo "" >> "$RESTORED_FILE"

    git show "$obj_id" >> "$RESTORED_FILE" 2>&1
    echo "" >> "$RESTORED_FILE"
    echo "---" >> "$RESTORED_FILE"
    echo "" >> "$RESTORED_FILE"
done

# Clean up temporary file
rm "$TEMP_FILE"

echo ""
echo "Recovery completed! Check $RESTORED_FILE for results."
echo "Processed $processed_count objects (ignored $ignored_count)"
echo ""
echo "To manage ignored objects:"
echo "- Edit $IGNORE_FILE to add/remove object IDs"
echo "- Uncomment lines (remove #) to ignore objects"
echo "- Comment lines (add #) to include objects"
echo ""
echo "Quick commands:"
echo "- View object summary: grep '^=== Object:' $RESTORED_FILE"
echo "- Add object to ignore: echo 'OBJECT_ID' >> $IGNORE_FILE"
