// spasm_tgx_bin_loader.js

var Spasm = Spasm || {};

Spasm.TGXBinLoader = function(filePath, callback)
{
	Spasm.BufferLoader.call(this, filePath, callback);

	this.filePositions = [];
};

Spasm.TGXBinLoader.prototype = Object.create(Spasm.BufferLoader.prototype);

Spasm.TGXBinLoader.prototype.onStateChange = function()
{
	var request = this.request;
	if (this.isComplete())
	{
		if (this.isCompleteAndOK())
		{
			var response = request.response;
			this.parseFileIndex(response);
		}

		this.callback(this);
	}
};

Spasm.TGXBinLoader.prototype.parseFileIndex = function(buffer)
{
	Spasm.assertArrayBuffer(buffer);
	this.buffer = buffer;

	var littleEndian = true;
	var dataView = new DataView(buffer);

	var magicNumbers =
			[
				dataView.getUint8(0),
				dataView.getUint8(1),
				dataView.getUint8(2),
				dataView.getUint8(3)
			];
	var expectedMagicWord = "TGXM";
	var expectedMagicNumbers =
			[
				expectedMagicWord.charCodeAt(0),
				expectedMagicWord.charCodeAt(1),
				expectedMagicWord.charCodeAt(2),
				expectedMagicWord.charCodeAt(3)
			];

	for (var magicNumberIndex in magicNumbers)
	{
		Spasm.assertEqual(magicNumbers[magicNumberIndex], expectedMagicNumbers[magicNumberIndex]);
	}

	var fileIndexByteStart = 16;
	var fileNameByteSize = 128;
	var fileByteOffsetByteSize = 8;
	var fileSizeByteSize = 8;

	var version = dataView.getInt32(4, littleEndian);
	if (version === 1)
	{
		// use the defaults
		fileNameByteSize = 128;
	}
	else if (version === 2)
	{
		fileNameByteSize = 256;

		var fileIdentifierByteStart = 16;
		var fileIdentifierByteSize = fileNameByteSize;
		var fileIdentifierDataView = new DataView(buffer, fileIdentifierByteStart, fileIdentifierByteSize);
		var fileIdentifier = "";
		for (var fileIdentifierCharIndex = 0;
			 fileIdentifierCharIndex < fileIdentifierByteSize;
			 fileIdentifierCharIndex++)
		{
			var fileIdentifierCharByte = fileIdentifierDataView.getUint8(fileIdentifierCharIndex);
			if (fileIdentifierCharByte !== 0)
			{
				fileIdentifier += String.fromCharCode(fileIdentifierCharByte);
			}
		}

		this.fileIdentifier = fileIdentifier;

		fileIndexByteStart += 256; // file pack identifier
	}
	else
	{
		Spasm.assert(false, "unknown TGX file pack version");
	}

	var fileIndexTotalByteSize = dataView.getInt32(8, littleEndian);
	var fileIndexCount = dataView.getInt32(12, littleEndian);
	Spasm.assert(fileIndexCount >= 0);

	var fileIndexByteSize = fileNameByteSize + fileByteOffsetByteSize + fileSizeByteSize;
	Spasm.assertEqual(fileIndexTotalByteSize, fileIndexByteSize);

	for (var fileIndexIndex = 0; fileIndexIndex < fileIndexCount; fileIndexIndex++)
	{
		var fileIndexByteOffset = fileIndexByteStart + (fileIndexByteSize * fileIndexIndex);
		var fileIndexDataView = new DataView(buffer, fileIndexByteOffset, fileIndexByteSize);
		var fileName = "";
		for (var fileNameCharIndex = 0; fileNameCharIndex < fileNameByteSize; fileNameCharIndex++)
		{
			var fileNameCharByte = fileIndexDataView.getUint8(fileNameCharIndex);
			if (fileNameCharByte !== 0)
			{
				fileName += String.fromCharCode(fileNameCharByte);
			}
		}

		// 64-bit integer types unsupported
		var fileByteOffsetHalf0 = fileIndexDataView.getUint32(fileNameByteSize, littleEndian);
		var fileByteOffsetHalf1 = fileIndexDataView.getUint32(fileNameByteSize + 4, littleEndian);
		var fileByteOffset = fileByteOffsetHalf0 + (Math.pow(2, 32) * fileByteOffsetHalf1);

		var fileByteSizeHalf0 = fileIndexDataView.getUint32(fileNameByteSize
															+ fileByteOffsetByteSize,
															littleEndian);
		var fileByteSizeHalf1 = fileIndexDataView.getUint32(fileNameByteSize
															+ fileByteOffsetByteSize
															+ 4,
															littleEndian);
		var fileByteSize = fileByteSizeHalf0 + (Math.pow(2, 32) * fileByteSizeHalf1);

		this.filePositions.push({fileName : fileName, fileByteOffset : fileByteOffset, fileByteSize : fileByteSize});
	}
};

Spasm.TGXBinLoader.prototype.getFileBuffers = function()
{
	var buffer = this.buffer;
	var filePositions = this.filePositions;

	Spasm.assertArrayBuffer(buffer);

	var fileBuffers = {};

	var filePositionCount = filePositions.length;
	for (var filePositionIndex = 0; filePositionIndex < filePositionCount; filePositionIndex++)
	{
		var filePosition = filePositions[filePositionIndex];
		var fileName = filePosition.fileName;
		var fileByteOffset = filePosition.fileByteOffset;
		var fileByteSize = filePosition.fileByteSize;

		var fileBuffer = buffer.slice(fileByteOffset, fileByteSize + fileByteOffset);
		fileBuffers[fileName] = fileBuffer;
		Spasm.assertEqual(fileBuffer.byteLength, fileByteSize);
	}

	return fileBuffers;
};
