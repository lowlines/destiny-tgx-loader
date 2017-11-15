// spasm_animation.js

var Spasm = Spasm || {};

Spasm.Animation = function(animationPath, callback)
{
	Spasm.assertPath(animationPath);
	Spasm.assertFunction(callback);

	this.animationPath = animationPath;
	this.callback = callback;

	this.loadComplete = false;
	this.loadSuccess = false;

	var self = this;
	var loadCallback = function(loader)
	{
		self.onLoadAnimation(loader);
	};

	this.animation = null;
	this.animationLoader = new Spasm.JSONLoader(animationPath, loadCallback);

	this.frameCount = 0;
	this.nodeCount = 0;

	this.framesMatrices = null;
	this.animationMatrices = null;

	this.tempMatrix0 = mat4.create();
};

Spasm.Animation.prototype = {};

Spasm.Animation.prototype.frameFillTransformBuffer = function(frameIndex,
															  transformBuffer,
															  inverseObjectSpaceTransformMatrices,
															  parentNodeIndices)
{
	Spasm.assertNumber(frameIndex);
	Spasm.assertInstance(transformBuffer, Float32Array);
	Spasm.assertArrayInstances(inverseObjectSpaceTransformMatrices, Float32Array);

	frameIndex = Math.floor(frameIndex);
	var framesMatrices = this.framesMatrices;
	var animationMatrices = this.animationMatrices;
	var tempMatrix0 = this.tempMatrix0;

	var frameCount = this.frameCount;
	var nodeCount = this.nodeCount;

	var inverseObjectSpaceTransformMatrixCount = inverseObjectSpaceTransformMatrices.length;
	var transformFloatCount = transformBuffer.length;

	Spasm.assert(frameIndex >= 0);
	Spasm.assert(frameIndex < frameCount);
	Spasm.assert(transformFloatCount === (nodeCount * 12));
	Spasm.assertEqual(nodeCount, inverseObjectSpaceTransformMatrixCount);

	var frameMatrices = framesMatrices[frameIndex];

	for (var nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++)
	{
		var frameMatrix = frameMatrices[nodeIndex];
		var animationMatrix = animationMatrices[nodeIndex];

		var inverseObjectSpaceTransformMatrix = inverseObjectSpaceTransformMatrices[nodeIndex];
		var parentNodeIndex = parentNodeIndices[nodeIndex];

		if (parentNodeIndex >= 0)
		{
			Spasm.assert(parentNodeIndex < nodeIndex);
			var parentAnimationMatrix = animationMatrices[parentNodeIndex];
			mat4.multiply(animationMatrix, parentAnimationMatrix, frameMatrix);
		}
		else
		{
			mat4.copy(animationMatrix, frameMatrix);
		}

		mat4.multiply(tempMatrix0, animationMatrix, inverseObjectSpaceTransformMatrix);
		mat4.transpose(tempMatrix0, tempMatrix0);
		transformBuffer.set(tempMatrix0.subarray(0, 12), nodeIndex * 12);
	}
};

Spasm.Animation.prototype.onLoadAnimationSuccess = function(response)
{
	Spasm.assertArray(response);

	this.loadSuccess = true;

	var animationCount = response.length;
	Spasm.assert(animationCount > 0);

	var animation = response[0];
	var nodeCount = animation.node_count;
	var frameCount = animation.frame_count;

	var staticBoneData = animation.static_bone_data;
	var staticScaleControlMap = staticBoneData.scale_control_map;
	var staticRotationControlMap = staticBoneData.rotation_control_map;
	var staticTranslationControlMap = staticBoneData.translation_control_map;
	var staticTransforms = staticBoneData.transform_stream_header.streams.frames[0];

	var staticScales = staticTransforms.scales;
	var staticRotations = staticTransforms.rotations;
	var staticTranslations = staticTransforms.translations;

	var animatedBoneData = animation.animated_bone_data;
	var animatedScaleControlMap = animatedBoneData.scale_control_map;
	var animatedRotationControlMap = animatedBoneData.rotation_control_map;
	var animatedTranslationControlMap = animatedBoneData.translation_control_map;
	var animatedTransformFrames = animatedBoneData.transform_stream_header.streams.frames;

	var framesMatrices = [];

	for (var frameIndex = 0; frameIndex < frameCount; frameIndex++)
	{
		var frameMatrices = [];

		var animatedTransforms = animatedTransformFrames[frameIndex];
		var animatedScales = animatedTransforms.scales;
		var animatedRotations = animatedTransforms.rotations;
		var animatedTranslations = animatedTransforms.translations;

		for (var nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++)
		{
			var staticScaleIndex = staticScaleControlMap.indexOf(nodeIndex);
			var staticRotationIndex = staticRotationControlMap.indexOf(nodeIndex);
			var staticTranslationIndex = staticTranslationControlMap.indexOf(nodeIndex);

			var animatedScaleIndex = animatedScaleControlMap.indexOf(nodeIndex);
			var animatedRotationIndex = animatedRotationControlMap.indexOf(nodeIndex);
			var animatedTranslationIndex = animatedTranslationControlMap.indexOf(nodeIndex);

			var scale = staticScaleIndex >= 0 ?
						staticScales[staticScaleIndex] : animatedScales[animatedScaleIndex];
			var rotation = staticRotationIndex >= 0 ?
						   staticRotations[staticRotationIndex] : animatedRotations[animatedRotationIndex];
			var translation = staticTranslationIndex >= 0
				?
							  staticTranslations[staticTranslationIndex]
				: animatedTranslations[animatedTranslationIndex];

			Spasm.assertValid(scale);
			Spasm.assertValid(rotation);
			Spasm.assertValid(translation);

			var nodeTransformSRT = new Spasm.TransformSRT(scale, rotation, translation);
			var nodeTransformMatrix = mat4.create();
			nodeTransformSRT.setMatrix(nodeTransformMatrix);

			frameMatrices.push(nodeTransformMatrix);
		}

		framesMatrices.push(frameMatrices);
	}

	this.nodeCount = nodeCount;
	this.frameCount = frameCount;
	this.framesMatrices = framesMatrices;

	var animationMatrices = [];
	for (var animationNodeIndex = 0; animationNodeIndex < nodeCount; animationNodeIndex++)
	{
		var animationMatrix = mat4.create();
		animationMatrices.push(animationMatrix);
	}

	this.animationMatrices = animationMatrices;

	if (this.callback)
	{
		this.callback(this, true);
		this.callback = null;
	}
};

Spasm.Animation.prototype.onLoadAnimationFailure = function()
{
	this.loadSuccess = false;
	if (this.callback)
	{
		this.callback(this, false);
		this.callback = null;
	}
};

Spasm.Animation.prototype.onLoadAnimation = function(loader)
{
	Spasm.assertInstance(loader, Spasm.JSONLoader);

	this.loadComplete = true;

	if (loader.isCompleteAndOK())
	{
		var response = loader.parsedResponse;
		this.onLoadAnimationSuccess(response);
	}
	else
	{
		this.onLoadAnimationFailure();
	}
};
