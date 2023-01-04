import React from 'react';
import {useState, useEffect, useRef} from 'react';

export const PhotoEditor = () => {
	const [image, setImage] = useState<HTMLImageElement>();
  const [options, setOptions] = useState({x: 0, y: 0, scale: 1});
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (image && canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');

      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(image, options.x, options.y, image.naturalWidth * options.scale, image.naturalHeight * options.scale);
		}
	}, [image, options.x, options.y, options.scale]);

	const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		// get all selected Files
		const files = e.target.files as FileList;
		let file;
		for ( let i = 0; i < files.length; ++i ) {
			file = files[ i ];
			// check if file is valid Image (just a MIME check)
			switch ( file.type ) {
				case "image/jpeg":
				case "image/png":
				case "image/gif":
					// read Image contents from file
					const reader = new FileReader();
					reader.onload = (e: ProgressEvent<FileReader>) => {
						// create HTMLImageElement holding image data
						const img = new Image();
						img.src = reader.result as string;
						img.onload = () => {
              if (canvasRef.current) {
                const editorCanvas = canvasRef.current;
                let scaleFactor = Math.max(editorCanvas?.width / img.width, editorCanvas?.height / img.height);
                
                // Finding the new width and height based on the scale factor
                let newWidth = img.width * scaleFactor;
                let newHeight = img.height * scaleFactor;
                
                // get the top left position of the image
                // in order to center the image within the canvas
                let x = (editorCanvas.width / 2) - (newWidth / 2);
                let y = (editorCanvas.height / 2) - (newHeight / 2);

                setOptions({x, y, scale: scaleFactor});
                setImage(img);
              }
            }
					};
					reader.readAsDataURL( file );
					// process just one file
					return;
			}
		}
	};

  const handleIncreaseZoomClick = () => {
    const {x, y, scale} = calculateZoomOptions(image, 1.1);

    setOptions({x, y, scale});
  }

  const handleDecreaseZoomClick = () => {
    const {x, y, scale} = calculateZoomOptions(image, 0.9);

    setOptions({x, y, scale});
  }

  const calculateZoomOptions = (img: any, scale: number) => {
    const currentWidth = img.width * options.scale;
    const currentHeight = img.height * options.scale;
    
    const newWidth = currentWidth * scale;
    const newHeight = currentHeight * scale;
    
    const xOffset = (newWidth - currentWidth) / 2;
    const yOffset = (newHeight - currentHeight) / 2;

    return {x: options.x - xOffset, y: options.y - yOffset, scale: options.scale * scale};
  }

  const handleTopClick = () => {
    setOptions({x: options.x, y: options.y - 10, scale: options.scale});
  }

  const handleBottomClick = () => {
    setOptions({x: options.x, y: options.y + 10, scale: options.scale});
  }

  const handleRightClick = () => {
    setOptions({x: options.x + 10, y: options.y, scale: options.scale});
  }

  const handleLeftClick = () => {
    setOptions({x: options.x - 10, y: options.y, scale: options.scale});
  }

  const handleExportClick = () => {
    const width: number = image?.width || 0;
    const height: number = image?.height || 0;
    const imgEncoded: string = canvasRef.current?.toDataURL() as string;

    const settings = getImageSettings({imgEncoded, width, height, options });

    saveSettingsFile(settings);
  }

  const getImageSettings = (
    {imgEncoded = "", width, height, options}:
    {imgEncoded: string, width: number, height: number, options:any }
  ) => {
    const { x, y, scale } = options;

    return `{
      "canvas": {
        "width": ${width},
        "height": ${height},
        "photo" : {
          "id": "image-configuration.json",
          "src": ${imgEncoded},
          "width": ${width * scale},
          "height": ${height * scale},
          "x": ${x},
          "y": ${y}
        }
      }
    }`;
  }

  const saveSettingsFile = (settings: string, fileName = "image-configuration.json") => {
    const element = document.createElement("a");
    const file = new Blob([settings], {type: "application/json"});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    element.click();
  }

	return (
		<>
			<div>
				<h1>Photo Editor</h1>
				<label htmlFor="fileSelector">Upload Images</label>
				<input type="file" id="fileSelector" onChange={handlePhotoUpload} />
			</div>
			<canvas ref={canvasRef} width={500} height={350} style={{border: '2px solid black'}} />

        <button onClick={handleIncreaseZoomClick}>+</button>
        <button onClick={handleDecreaseZoomClick}>-</button>

        <button onClick={handleTopClick}>Top</button>
        <button onClick={handleBottomClick}>Bottom</button>
        <button onClick={handleRightClick}>Right</button>
        <button onClick={handleLeftClick}>Left</button>

        <button onClick={handleExportClick}>Export</button>
		</>
	);
};