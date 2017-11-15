// spasm_webgl_gear_renderable.js

var Spasm = Spasm || {};

Spasm.GearRenderable = function(itemId, renderableModels)
{
	Spasm.assertString(itemId);
	Spasm.assertArrayInstances(renderableModels, Spasm.GearRenderableModel);

	this.itemId = itemId;
	this.renderableModels = renderableModels;
};

Spasm.GearRenderable.prototype = {};

Spasm.GearRenderable.prototype.getBoundingVolume = function()
{
	var boundingVolumes = this.getBoundingVolumes();
	var boundingVolume = Spasm.boundingVolumeFromBoundingVolumes(boundingVolumes);

	return boundingVolume;
};

Spasm.GearRenderable.prototype.getBoundingVolumes = function()
{
	var renderableModels = this.renderableModels;
	var renderableModelCount = renderableModels.length;

	var boundingVolumes = [];
	for (var renderableModelIndex = 0; renderableModelIndex < renderableModelCount; renderableModelIndex++)
	{
		var renderableModel = renderableModels[renderableModelIndex];
		var renderables = renderableModel.renderables;
		var renderableCount = renderables.length;

		for (var renderableIndex = 0; renderableIndex < renderableCount; renderableIndex++)
		{
			var renderable = renderables[renderableIndex];
			var boundingVolume = renderable.boundingVolume;
			boundingVolumes.push(boundingVolume);
		}
	}

	return boundingVolumes;
};

Spasm.GearRenderable.prototype.setGearShaders = function(gearShaders)
{
	Spasm.assertInstance(gearShaders, Spasm.GearShader);

	this.gearShaders = gearShaders;

	var renderableModels = this.renderableModels;
	var renderableModelCount = renderableModels.length;

	for (var renderableModelIndex = 0; renderableModelIndex < renderableModelCount; renderableModelIndex++)
	{
		var renderableModel = renderableModels[renderableModelIndex];
		renderableModel.setGearShaders(gearShaders);
	}
};

Spasm.GearRenderable.prototype.getResolvedDyeList = function(gearDyes, shaderOverrideDyes)
{
	Spasm.assertValid(gearDyes);

	var defaultDyes = gearDyes.defaultDyes;
	var lockedDyes = gearDyes.lockedDyes;

	var resolvedDyes = {};

	var defaultDyeCount = defaultDyes.length;
	for (var defaultDyeIndex = 0; defaultDyeIndex < defaultDyeCount; defaultDyeIndex++)
	{
		var defaultDye = defaultDyes[defaultDyeIndex];
		resolvedDyes[defaultDye.slotTypeIndex] = defaultDye;
	}

	if (shaderOverrideDyes)
	{
		Spasm.assertValid(shaderOverrideDyes);

		var customDyes = shaderOverrideDyes.customDyes;
		var customDyeCount = customDyes.length;
		for (var customDyeIndex = 0; customDyeIndex < customDyeCount; customDyeIndex++)
		{
			var customDye = customDyes[customDyeIndex];
			resolvedDyes[customDye.slotTypeIndex] = customDye;
		}
	}

	var lockedDyeCount = lockedDyes.length;
	for (var lockedDyeIndex = 0; lockedDyeIndex < lockedDyeCount; lockedDyeIndex++)
	{
		var lockedDye = lockedDyes[lockedDyeIndex];
		resolvedDyes[lockedDye.slotTypeIndex] = lockedDye;
	}

	var resolvedDyeKeys = Object.keys(resolvedDyes);
	var resolvedDyeKeyCount = resolvedDyeKeys.length;

	var resolvedDyeList = [];
	for (var resolvedDyeKeyIndex = 0; resolvedDyeKeyIndex < resolvedDyeKeyCount; resolvedDyeKeyIndex++)
	{
		var resolvedDyeKey = resolvedDyeKeys[resolvedDyeKeyIndex];
		var resolvedDye = resolvedDyes[resolvedDyeKey];
		resolvedDyeList.push(resolvedDye);
	}

	return resolvedDyeList;
};

Spasm.GearRenderable.prototype.setGearDyes = function(gearDyes)
{
	Spasm.assertValid(gearDyes);

	this.gearDyes = gearDyes;
	var resolvedDyeList = this.getResolvedDyeList(gearDyes, null);

	var renderableModels = this.renderableModels;
	var renderableModelCount = renderableModels.length;
	for (var renderableModelIndex = 0; renderableModelIndex < renderableModelCount; renderableModelIndex++)
	{
		var renderableModel = renderableModels[renderableModelIndex];
		renderableModel.setGearDyes(resolvedDyeList);
	}
};

Spasm.GearRenderable.prototype.setShaderOverrideDyes = function(shaderOverrideDyes)
{
	if (shaderOverrideDyes)
	{
		Spasm.assertValid(shaderOverrideDyes);

		this.shaderOverrideDyes = shaderOverrideDyes;

		var resolvedDyeList = this.getResolvedDyeList(this.gearDyes, shaderOverrideDyes);
		var renderableModels = this.renderableModels;

		var renderableModelCount = renderableModels.length;
		for (var renderableModelIndex = 0; renderableModelIndex < renderableModelCount; renderableModelIndex++)
		{
			var renderableModel = renderableModels[renderableModelIndex];
			renderableModel.setGearDyes(resolvedDyeList);
		}
	}
	else
	{
		this.setGearDyes(this.gearDyes);
	}
};

Spasm.GearRenderable.prototype.render = function(isMuted, variantsByCount)
{
	var renderableModels = this.renderableModels;

	var renderableModelCount = renderableModels.length;
	for (var renderableModelIndex = 0; renderableModelIndex < renderableModelCount; renderableModelIndex++)
	{
		var renderableModel = renderableModels[renderableModelIndex];
		renderableModel.render(isMuted, variantsByCount);
	}
};

Spasm.GearRenderableModel = function(renderModelId, renderables)
{
	Spasm.assertString(renderModelId);
	Spasm.assertArrayInstances(renderables, Spasm.Renderable);

	this.renderModelId = renderModelId;
	this.renderables = renderables;

	this.partExternalIdentifiers = {};

	var renderableCount = renderables.length;
	for (var renderableIndex = 0; renderableIndex < renderableCount; renderableIndex++)
	{
		var renderable = renderables[renderableIndex];
		var renderablePartExternalIdentifiers = renderable.partExternalIdentifiers;

		var keys = Object.keys(renderablePartExternalIdentifiers);
		var keyCount = keys.length;
		for (var keyIndex = 0; keyIndex < keyCount; keyIndex++)
		{
			var key = keys[keyIndex];
			this.partExternalIdentifiers[key] = "";
		}
	}

	this.partExternalIdentifierCount = Object.keys(this.partExternalIdentifiers).length;
};

Spasm.GearRenderableModel.prototype = {};

Spasm.GearRenderableModel.prototype.setGearShaders = function(gearShaders)
{
	Spasm.assertInstance(gearShaders, Spasm.GearShader);

	this.gearShaders = gearShaders;

	var renderables = this.renderables;
	var renderableCount = renderables.length;
	for (var renderableIndex = 0; renderableIndex < renderableCount; renderableIndex++)
	{
		var renderable = renderables[renderableIndex];
		renderable.setGearShaders(gearShaders);
	}
};

Spasm.GearRenderableModel.prototype.setGearDyes = function(gearDyes)
{
	Spasm.assertArrayInstances(gearDyes, Spasm.GearDye);

	this.gearDyes = gearDyes;

	var renderables = this.renderables;
	var renderableCount = renderables.length;

	for (var renderableIndex = 0; renderableIndex < renderableCount; renderableIndex++)
	{
		var renderable = renderables[renderableIndex];
		renderable.setGearDyes(gearDyes);
	}
};

Spasm.GearRenderableModel.prototype.render = function(isMuted, variantsByCount)
{
	var renderables = this.renderables;

	var variants = null;
	if (variantsByCount)
	{
		variants = variantsByCount[this.partExternalIdentifierCount];
	}

	var renderableCount = renderables.length;
    for (var renderableIndex = 0; renderableIndex < renderableCount; renderableIndex++)
	{
		var renderable = renderables[renderableIndex];
		renderable.render(isMuted, variants);
	}
};
