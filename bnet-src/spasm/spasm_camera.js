// spasm_camera.js

var Spasm = Spasm || {};

Spasm.Camera = function(canvas)
{
	Spasm.assertCanvas(canvas);

	this.canvas = canvas;

	this.canvasSize =
	{
		width : canvas.width,
		height : canvas.height,
		aspectRatio : canvas.width / canvas.height
	};

	this.orientation =
	{
		modelTranslationHorizontal : 0.0,
		modelTranslationVertical : 1.0,
		modelTranslationDepth : 0.0,

		modelRotationHorizontal : 0.0,
		modelRotationVertical : 0.0,
		modelRotationZ : 0.0,

		viewDistance : 9.0,

		viewTranslationHorizontal : 0.0,
		viewTranslationVertical : 0.0
	};

	this.bounds =
	{
		viewTranslationMinHorizontal : -2.0,
		viewTranslationMinVertical : -2.0,

		viewTranslationMaxHorizontal : 2.0,
		viewTranslationMaxVertical : 2.0,

		modelRotationMinVertical : -85.0 * Spasm.Deg2Rad,
		modelRotationMaxVertical : 85.0 * Spasm.Deg2Rad,

		viewDistanceDefault : 9.0,
		viewDistanceMin : 0.5,
		viewDistanceMax : 20
	};

	this.dirtyFlags =
	{
		modelTranslation : true,
		modelRotation : true,
		view : true,
		projection : true
	};

	this.projection =
	{
		fieldOfView : 15.0 * Spasm.Deg2Rad,
		nearPlane : 0.1,
		farPlane : 10
	};

	this.vectors =
	{
		viewDirection : vec3.set(vec3.create(), 1.0, 0.0, 0.0),
		viewPosition : vec3.set(vec3.create(), 5.0, 0.0, 0.0),
		viewTarget : vec3.create(),
		viewUp : vec3.set(vec3.create(), 0.0, 0.0, 1.0),
		viewTranslation : vec3.create(),

		modelTranslation : vec3.create(),
		modelRotationAxis : vec3.set(vec3.create(), 1.0, 0.0, 0.0)
	};

	var inputTypes = Spasm.Shader.InputTypes;
	var valueTypes = Spasm.Shader.ValueTypes;

	this.matrices =
	{
		identity : mat4.create(),
		identity34 : mat4.create().subarray(0, 12),
		cameraRotation : mat4.create(),
		modelTranslation : mat4.create(),
		modelRotation : mat4.create(),
		model : mat4.create(),
		view : mat4.create(),
		projection : mat4.create()
	};

	this.uniforms =
	{
		modelMatrix : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.mat4, "u_model_matrix"),
		viewMatrix : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.mat4, "u_view_matrix"),
		projectionMatrix : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.mat4, "u_projection_matrix")
	};

	this.uniformDatas =
	{
		modelMatrix : new Spasm.UniformData(this.uniforms.modelMatrix, this.matrices.model),
		viewMatrix : new Spasm.UniformData(this.uniforms.viewMatrix, this.matrices.view),
		projectionMatrix : new Spasm.UniformData(this.uniforms.projectionMatrix, this.matrices.projection)
	};
};

Spasm.Camera.prototype = {};

Spasm.Camera.prototype.updateCanvasSize = function()
{
	var canvas = this.canvas;
	var canvasSize = this.canvasSize;

	var canvasWidth = Math.abs(canvas.width);
	var canvasHeight = Math.abs(canvas.height);

	if (canvasWidth !== canvasSize.width
		|| canvasHeight !== canvasSize.height)
	{
		canvasSize.width = canvasWidth;
		canvasSize.height = canvasHeight;

		canvasSize.aspectRatio = canvasWidth / canvasHeight;

		this.dirtyFlags.projection = true;
	}
};

Spasm.Camera.prototype.updateMatrices = function()
{
	this.updateCanvasSize();

	var orientation = this.orientation;
	var dirtyFlags = this.dirtyFlags;
	var projection = this.projection;
	var canvasSize = this.canvasSize;

	var vectors = this.vectors;
	var matrices = this.matrices;

	if (dirtyFlags.projection)
	{
		mat4.perspective(matrices.projection,
						 projection.fieldOfView,
						 canvasSize.aspectRatio,
						 projection.nearPlane,
						 projection.farPlane);

		dirtyFlags.projection = false;
	}

	var dirtyModelMatrix = false;

	if (dirtyFlags.modelTranslation)
	{
		vec3.set(vectors.modelTranslation,
				 orientation.modelTranslationDepth,
				 orientation.modelTranslationHorizontal,
				 -orientation.modelTranslationVertical);

		mat4.translate(matrices.modelTranslation, matrices.identity, vectors.modelTranslation);

		dirtyModelMatrix = true;
		dirtyFlags.modelTranslation = false;
	}

	if (dirtyFlags.modelRotation)
	{
		var modelRotationMatrix = matrices.modelRotation;
		mat4.identity(modelRotationMatrix);
		mat4.rotateY(modelRotationMatrix, modelRotationMatrix, orientation.modelRotationVertical);
		mat4.rotateZ(modelRotationMatrix, modelRotationMatrix, orientation.modelRotationHorizontal);
		mat4.rotateY(modelRotationMatrix, modelRotationMatrix, orientation.modelRotationZ);

		dirtyModelMatrix = true;
		dirtyFlags.modelRotation = false;
	}

	if (dirtyModelMatrix)
	{
		mat4.multiply(matrices.model, matrices.modelRotation, matrices.modelTranslation);
	}

	if (dirtyFlags.view)
	{
		var viewDirection = vectors.viewDirection;
		var viewPosition = vectors.viewPosition;
		var viewTarget = vectors.viewTarget;
		var viewUp = vectors.viewUp;
		var viewTranslation = vectors.viewTranslation;

		var viewDistance = orientation.viewDistance;

		vec3.scale(viewPosition, viewDirection, viewDistance);
		vec3.add(viewPosition, viewPosition, viewTarget);

		mat4.lookAt(matrices.view, viewPosition, viewTarget, viewUp);

		var viewTranslationHorizontal = orientation.viewTranslationHorizontal;
		var viewTranslationVertical = orientation.viewTranslationVertical;
		vec3.set(viewTranslation, viewTranslationHorizontal, -viewTranslationVertical, 0.0);

		mat4.translate(matrices.view, matrices.view, viewTranslation);

		dirtyFlags.view = false;
	}
};

Spasm.Camera.prototype.updateForBoundingVolume = function(boundingVolume, focused, centered)
{
	Spasm.assertInstance(boundingVolume, Spasm.BoundingVolume);
	Spasm.assertBoolean(focused);
	Spasm.assertBoolean(centered);

	var boundingVolumeMaxLength = boundingVolume.getMaxLength();

	var centerPoint = boundingVolume.getCenterPoint();
	var centerPointLength = centerPoint[0];
	var centerPointWidth = centerPoint[1];
	var centerPointHeight = centerPoint[2];

	var orientation = this.orientation;

	orientation.modelTranslationHorizontal = -centerPointWidth;
	orientation.modelTranslationVertical = centerPointHeight * 0.9;

	var viewDistance = this.bound(boundingVolumeMaxLength * 4.5, 4.0, 90.0);
	
	if (centered)
	{
		var aspectRatio = this.canvasSize.aspectRatio;

		orientation.viewDistance = viewDistance / aspectRatio;
		orientation.viewTranslationHorizontal = 0;
		orientation.modelTranslationDepth = -centerPointLength;

		orientation.modelRotationHorizontal = -60.0 * Spasm.Deg2Rad;
		orientation.modelRotationVertical = 15.0 * Spasm.Deg2Rad;
	}
	else if (focused)
	{
		orientation.viewDistance = viewDistance;
		orientation.viewTranslationHorizontal = 0;
		orientation.modelTranslationDepth = -centerPointLength;

		orientation.modelRotationHorizontal = -60.0 * Spasm.Deg2Rad;
		orientation.modelRotationVertical = 15.0 * Spasm.Deg2Rad;
	}
	else
	{
		orientation.modelTranslationDepth = 0.0;

		orientation.viewTranslationVertical = 0.0;
		orientation.viewTranslationHorizontal = 0.0;

		orientation.modelRotationHorizontal = 10.0 * Spasm.Deg2Rad;
		orientation.modelRotationVertical = 0.0;

		orientation.viewDistance = 8.2;
	}

	var bounds = this.bounds;
	bounds.viewDistanceDefault = orientation.viewDistance;
	bounds.viewDistanceMin = orientation.viewDistance * 0.5;
	bounds.viewDistanceMax = orientation.viewDistance * 2.0;

	var projection = this.projection;
	projection.farPlane = orientation.viewDistance * 3.0;
	projection.nearPlane = orientation.viewDistance * 0.1;

	var dirtyFlags = this.dirtyFlags;
	dirtyFlags.modelTranslation = true;
	dirtyFlags.modelRotation = true;
	dirtyFlags.view = true;
	dirtyFlags.projection = true;
};

Spasm.Camera.prototype.bound = function(value, min, max)
{
	Spasm.assertNumber(value);
	Spasm.assertNumber(min);
	Spasm.assertNumber(max);
	Spasm.assert(min <= max);

	var boundedValue = Math.max(Math.min(value, max), min);
	return boundedValue;
};

Spasm.Camera.prototype.setRotationZDegrees = function(rotationZDegrees)
{
	Spasm.assertNumber(rotationZDegrees,
					   "Spasm.Camera.setRotationZDegrees: input is not a number" + rotationZDegrees);

	var orientation = this.orientation;
	orientation.modelRotationZ = rotationZDegrees * Spasm.Deg2Rad;
};

Spasm.Camera.prototype.userRotate = function(deltaX, deltaY)
{
	Spasm.assertNumber(deltaX);
	Spasm.assertNumber(deltaY);

	var orientation = this.orientation;
	var bounds = this.bounds;
	var dirtyFlags = this.dirtyFlags;

	orientation.modelRotationHorizontal += deltaX * 0.01;
	orientation.modelRotationVertical += deltaY * 0.01;

	orientation.modelRotationVertical = this.bound(orientation.modelRotationVertical,
												   bounds.modelRotationMinVertical,
												   bounds.modelRotationMaxVertical);

	dirtyFlags.modelRotation = true;
};

Spasm.Camera.prototype.userTranslate = function(deltaX, deltaY)
{
	Spasm.assertNumber(deltaX);
	Spasm.assertNumber(deltaY);

	var orientation = this.orientation;
	var bounds = this.bounds;
	var dirtyFlags = this.dirtyFlags;

	orientation.viewTranslationHorizontal += deltaX * 0.005;
	orientation.viewTranslationVertical += deltaY * 0.005;

	orientation.viewTranslationHorizontal = this.bound(orientation.viewTranslationHorizontal,
													   bounds.viewTranslationMinHorizontal,
													   bounds.viewTranslationMaxHorizontal);

	orientation.viewTranslationVertical = this.bound(orientation.viewTranslationVertical,
													 bounds.viewTranslationMinVertical,
													 bounds.viewTranslationMaxVertical);

	dirtyFlags.modelTranslation = true;
};

Spasm.Camera.prototype.userZoom = function(delta)
{
	Spasm.assertNumber(delta);

	var orientation = this.orientation;
	var bounds = this.bounds;
	var dirtyFlags = this.dirtyFlags;

	orientation.viewDistance += delta * -0.0010;
	orientation.viewDistance = this.bound(orientation.viewDistance,
										  bounds.viewDistanceMin,
										  bounds.viewDistanceMax);

	dirtyFlags.view = true;
};

Spasm.Camera.prototype.isDirty = function()
{
	var dirtyFlags = this.dirtyFlags;
	var cameraDirtyKeys = Object.keys(dirtyFlags);
	var cameraDirtyKeysLength = cameraDirtyKeys.length;
	var isDirty = false;

	for (var dirtyFlagIndex = 0; dirtyFlagIndex < cameraDirtyKeysLength; dirtyFlagIndex++)
	{
		var dirtyFlagKey = cameraDirtyKeys[dirtyFlagIndex];
		if (dirtyFlags[dirtyFlagKey])
		{
			isDirty = true;
		}
	}

	return isDirty;
};

Spasm.Camera.prototype.resetZoom = function()
{
	var orientation = this.orientation;
	var bounds = this.bounds;
	var dirtyFlags = this.dirtyFlags;

	orientation.viewDistance = bounds.viewDistanceDefault;
	dirtyFlags.view = true;
};
