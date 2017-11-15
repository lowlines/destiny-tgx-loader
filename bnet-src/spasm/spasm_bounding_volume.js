// spasm_bounding_volume.js

var Spasm = Spasm || {};

Spasm.BoundingVolume = function(valuesX, valuesY, valuesZ)
{
	Spasm.assertArray(valuesX);
	Spasm.assertArray(valuesY);
	Spasm.assertArray(valuesZ);

	this.minX = Math.min.apply(Math, valuesX);
	this.minY = Math.min.apply(Math, valuesY);
	this.minZ = Math.min.apply(Math, valuesZ);

	this.maxX = Math.max.apply(Math, valuesX);
	this.maxY = Math.max.apply(Math, valuesY);
	this.maxZ = Math.max.apply(Math, valuesZ);
};

Spasm.boundingVolumeFromRenderMetadata = function(renderMetadataBoundingVolume)
{
	Spasm.assertValid(renderMetadataBoundingVolume);

	var minX = renderMetadataBoundingVolume.min_x;
	var minY = renderMetadataBoundingVolume.min_y;
	var minZ = renderMetadataBoundingVolume.min_z;

	var maxX = renderMetadataBoundingVolume.max_x;
	var maxY = renderMetadataBoundingVolume.max_y;
	var maxZ = renderMetadataBoundingVolume.max_z;

	var boundingVolume = new Spasm.BoundingVolume([minX, maxX], [minY, maxY], [minZ, maxZ]);
	return boundingVolume;
};

Spasm.boundingVolumeFromBoundingVolumes = function(boundingVolumes)
{
	Spasm.assertArrayInstances(boundingVolumes, Spasm.BoundingVolume);

	var valuesX = [];
	var valuesY = [];
	var valuesZ = [];

	var boundingVolumeCount = boundingVolumes.length;
	for (var boundingVolumeIndex = 0; boundingVolumeIndex < boundingVolumeCount; boundingVolumeIndex++)
	{
		var boundingVolume = boundingVolumes[boundingVolumeIndex];

		valuesX.push(boundingVolume.minX);
		valuesX.push(boundingVolume.maxX);

		valuesY.push(boundingVolume.minY);
		valuesY.push(boundingVolume.maxY);

		valuesZ.push(boundingVolume.minZ);
		valuesZ.push(boundingVolume.maxZ);
	}

	var compositeBoundingVolume = new Spasm.BoundingVolume(valuesX, valuesY, valuesZ);
	return compositeBoundingVolume;
};

Spasm.BoundingVolume.prototype = {};

Spasm.BoundingVolume.prototype.getMaxLength = function()
{
	var maxLength = Math.sqrt(Math.pow(this.maxX - this.minX, 2)
							  + Math.pow(this.maxY - this.minY, 2)
							  + Math.pow(this.maxZ - this.minZ, 2));
	return maxLength;
};

Spasm.BoundingVolume.prototype.getCenterPoint = function()
{
	var centerPoint = [(this.minX + this.maxX) / 2,
					   (this.minY + this.maxY) / 2,
					   (this.minZ + this.maxZ) / 2];

	return centerPoint;
};
