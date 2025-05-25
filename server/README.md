# Synthetic Realities
## Server

### on Macos

Dont forget to launch mongodb service

```
brew services start mongodb-community@8.0
brew services stop mongodb-community@8.0
````

### mongo visual

You can use mongo-gui to see the database.

After installation you will need to launch it from a repository with a .env including OPENAI_API_KEY=YOUR_API_KEY_HERE.

```
    mongo-gui -p 3018
```

### How to test
npm run test 

### How to launch
npm run dev

## How to process imgs on front and server

First you need to include your new images in the front repository.

front/src/assets/imgs/*

### Then generate a cards.json
    The json should look like that
    ```
        [
            {
                "name": "1",
                "isHuman": false,
                "isAI": true,
                "original_name": "dalle3-00256"
            },
        ...
        ]
    ```

If needed:
```
 python add_random_names.py input.json output.json
```

### import new cards.json to DB
```
    npm run seed
```

### launch rename (with the need cards.json at the root)
```
    node renameImages.js ../../../front/src/assets/imgs
```

### launch extension fixor + compress
Convert all images to jpg
```
python convert_img_to_jpg.py path_to_imgs
```
that will rewrite the files to jpg in cooked folder
check number is still good
then copy cooked/* to ..

```
python src/init/compress_images.py ../front/src/assets/imgs ../front/src/assets/imgs_compressed
```
copy imgs_compressed/* to ../imgs

### generate import files
python generate_import.py ../../../front/src/assets/imgs
copy the new imageList.tsx to front/src/components

You are ready to play.
