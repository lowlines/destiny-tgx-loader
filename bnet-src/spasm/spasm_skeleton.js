// spasm_skeleton.js

var Spasm = Spasm || {};

Spasm.Skeleton = function(skeletonPath, callback)
{
	Spasm.assertPath(skeletonPath);
	Spasm.assertFunction(callback);

	this.skeletonPath = skeletonPath;
	this.callback = callback;

	this.loadComplete = false;
	this.loadSuccess = false;

	var self = this;
	var loadCallback = function(loader)
	{
		self.onLoadSkeleton(loader);
	};

	this.skeleton = null;
	this.skeletonLoader = new Spasm.JSONLoader(skeletonPath, loadCallback);

	this.inverseObjectSpaceTransformMatrices = null;
	this.parentNodeIndices = null;
	this.nodeCount = 0;
};

Spasm.Skeleton.prototype = {};

Spasm.Skeleton.prototype.onLoadSkeletonSuccess = function(response)
{
	Spasm.assertValid(response);

	this.loadSuccess = true;

	var skeletonDefinition = response.definition;
	// var objectSpaceTransforms = skeletonDefinition.default_object_space_transforms;
	var inverseObjectSpaceTransforms = skeletonDefinition.default_inverse_object_space_transforms;
	var nodes = skeletonDefinition.nodes;

	var inverseObjectSpaceTransformMatrices = [];
	var parentNodeIndices = [];

	var nodeCount = inverseObjectSpaceTransforms.length;
	for (var nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++)
	{
		var inverseObjectSpaceTransform = inverseObjectSpaceTransforms[nodeIndex];
		var translationScale = inverseObjectSpaceTransform.ts;

		var scale = translationScale[3];
		var rotation = inverseObjectSpaceTransform.r;
		var translation = [translationScale[0], translationScale[1], translationScale[2]];

		var inverseObjectSpaceTransformSRT = new Spasm.TransformSRT(scale, rotation, translation);
		var inverseObjectSpaceTransformMatrix = mat4.create();
		inverseObjectSpaceTransformSRT.setMatrix(inverseObjectSpaceTransformMatrix);

		inverseObjectSpaceTransformMatrices.push(inverseObjectSpaceTransformMatrix);

		var node = nodes[nodeIndex];
		var parentNodeIndex = node.parent_node_index;
		parentNodeIndices.push(parentNodeIndex);
	}

	this.inverseObjectSpaceTransformMatrices = inverseObjectSpaceTransformMatrices;
	this.parentNodeIndices = parentNodeIndices;

	if (this.callback)
	{
		this.callback(this, true);
		this.callback = null;
	}
};

Spasm.Skeleton.prototype.onLoadSkeletonFailure = function()
{
	this.loadSuccess = false;

	if (this.callback)
	{
		this.callback(this, false);
		this.callback = null;
	}
};

Spasm.Skeleton.prototype.onLoadSkeleton = function(loader)
{
	Spasm.assertInstance(loader, Spasm.JSONLoader);

	this.loadComplete = true;

	if (loader.isCompleteAndOK())
	{
		var response = loader.parsedResponse;
		this.onLoadSkeletonSuccess(response);
	}
	else
	{
		this.onLoadSkeletonFailure();
	}
};
