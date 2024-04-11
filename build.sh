#!/bin/bash

function to_camel_case() {
  local IFS='-'
  read -ra ADDR <<< "$1"
  local camel_case_string=""
  for i in "${ADDR[@]}"; do
    # capitalize the first letter of each word
    i="$(tr '[:lower:]' '[:upper:]' <<< ${i:0:1})${i:1}"
    camel_case_string+="$i"
  done
  echo "$camel_case_string"
}

# Parse command line arguments
while [[ $# -gt 0 ]]
do
  key="$1"
  case $key in
    -e|--environment)
      environment="$2"
      shift # past argument
      shift # past value
      ;;
    *) # unknown option
      shift # past argument
      ;;
  esac
done

# Set domain based on environment
if [ "$environment" == "prod" ]; then
  domain=""
elif [ "$environment" == "test" ]; then
  domain=""
elif [ "$environment" == "dev" ]; then
  domain="bfj.generalsolutions43.com"
else
  echo "Invalid environment specified. Please use 'prod', 'test', or 'dev'."
  exit 1
fi

if [ -d "dist" ]; then
  rm -r dist
fi

# Path to the main JavaScript file
app_file="app.js"

# Path to the JavaScript files in the components directory
js_files=(components/*.js)

# Path to the CSS files
css_files=("styles.css" "reset.css" "web-components.css")

# Path to your HTML file
html_file="index.html"

# Directory to store the new files
dist_folder="dist"
dist_components_folder="dist/components"

# Create the dist folder and components subfolder if they don't exist
mkdir -p $dist_folder
mkdir -p $dist_components_folder

# Copy the HTML file to the dist folder
cp $html_file $dist_folder

# Copy the utils file to the dist folder
cp utils.js $dist_folder

# Copy the constants file to the dist folder
cp constants.js $dist_folder

# Generate a hash of the JavaScript file
filehash=$(md5sum $app_file | cut -d ' ' -f 1)

# New JavaScript file name with hash in the dist folder
new_app_file="$dist_folder/$(basename $app_file .js)-${filehash}.js"

# Copy the JavaScript file to the new location with the new name
cp $app_file $new_app_file

# Process JavaScript files
for js_file in "${js_files[@]}"; do
  filehash=$(md5sum $js_file | cut -d ' ' -f 1)
  new_js_file="$dist_components_folder/$(basename $js_file .js)-${filehash}.js"
  cp $js_file $new_js_file
  sed -i 's|http://localhost:8000|https://'"$domain"'|g' $new_js_file
  
  # Update the main js file with the new JavaScript file name
  sed -i "s|$(basename $js_file)|$(basename $js_file .js)-$filehash.js|g" $new_app_file
done

# Post process JavaScript files
# iterate over all the js files in the dist/components folder
for component_file in $dist_components_folder/*.js; do
  new_filename=$(basename $component_file)
  echo $new_filename
  
  filename=$(echo $new_filename | sed -r 's/-[a-f0-9]{32}//')
  echo $filename
  
  class_name=$(to_camel_case $filename)
  echo $class_name

  find $dist_components_folder -type f -name '*.js' -exec sed -i "s|from './$filename'|from './$new_filename'|g" {} \;
done

# Process CSS files
for css_file in "${css_files[@]}"; do
  csshash=$(md5sum $css_file | cut -d ' ' -f 1)
  new_css_file="$dist_folder/$(basename $css_file .css)-${csshash}.css"
  cp $css_file $new_css_file
  
  # Update the HTML file with the new CSS file name
  sed -i 's|'$(basename $css_file)'|'$(basename $css_file .css)'-'$csshash'.css|g' $dist_folder/$html_file
done

# Update the HTML file in the dist folder with the new JavaScript file name and domain
sed -i 's|'$(basename $app_file)'|'$(basename $new_app_file)'|g' $dist_folder/$html_file
# sed -i 's|http://localhost:8000|https://'"$domain"'|g' $new_js_file

echo "Cache busting done. Files copied to dist and HTML references updated."