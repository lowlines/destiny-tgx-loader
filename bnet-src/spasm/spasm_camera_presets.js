var Spasm = Spasm || {};

Spasm.CameraPresets = function (buckets) {
	this.buckets = buckets;

	this.inventoryPresets = {};
};

Spasm.CameraPresets.prototype = {};

Spasm.CameraPresets.prototype.init = function ()
{
	this.setInventoryBuckets();
};

Spasm.CameraPresets.prototype.setInventoryBuckets = function () {
	for (var bucketIndex in this.buckets) {
		var bucket = this.buckets[bucketIndex];
		if (bucketDefinition = bucket.definition) {
			var bucketId = bucketDefinition.bucketIdentifier;
			switch (bucketId) {
				case "BUCKET_PRIMARY_WEAPON":
				case "BUCKET_SPECIAL_WEAPON":
				case "BUCKET_HEAVY_WEAPON":
				case "BUCKET_HEAD":
				case "BUCKET_ARMS":
				case "BUCKET_CHEST":
				case "BUCKET_CLASS_ITEMS":
				case "BUCKET_LEGS":
				case "BUCKET_SHIP":
					this.setInventoryPresets(bucket);
					break;

				default:
					break;
			}
		}
	}
};

Spasm.CameraPresets.prototype.setInventoryPresets = function(bucket)
{
	var items = bucket.items;
    var itemCount = items.length;
    for (var itemIndex = 0; itemIndex < itemCount; itemIndex++)
    {
		var item = items[itemIndex];
		var itemDefinition = item.itemDefinition;
        var itemTypeName = itemDefinition.summary.itemTypeName.toLowerCase();
        var itemReferenceId = itemDefinition.summary.referenceId;
        var preset = {};

        switch (itemTypeName)
        {
            case "hand cannon":
                preset = this.presetWeaponSmall();
                break;
            case "auto rifle":
            case "pulse rifle":
            case "scout rifle":
            case "fusion rifle":
            case "shotgun":
                preset = this.presetWeaponMedium();
                break;
            case "machine gun":
            case "sniper rifle":
                preset = this.presetWeaponLarge();
                break;
            case "rocket launcher":
                preset = this.presetWeaponRocket();
                break;
            case "head armor":
                preset = this.presetHeadArmor();
                break;
            case "leg armor":
                preset = this.presetLegArmor();
                break;
            case "titan mark  ":
                preset = this.presetCloth();
                break;
            case "hunter cloak":
                preset = this.presetHunterCloth();
                break;
            case "ship":
                preset = this.presetShip();
                break;
            // Armor
            case "warlock bond":
            default:
                preset = this.presetDefault();
                break;
        }
        this.inventoryPresets[itemReferenceId] = preset;
	}
};

Spasm.CameraPresets.prototype.presetWeaponSmall = function () {
	var preset = {};
	preset.modelVertical = 0.05;
	preset.modelHorizontal = 0.2;
	preset.cameraDistance = 1.5;
    preset.cameraRotateHorizontal = -90 * Spasm.Deg2Rad;
    return preset;
};

Spasm.CameraPresets.prototype.presetWeaponMedium = function () {
	var preset = {};
	preset.modelVertical = 0.05;
	preset.modelHorizontal = 0.0;
	preset.cameraDistance = 2.4;
	preset.cameraRotateVertical = 15.0 * Spasm.Deg2Rad;
    preset.cameraRotateHorizontal = -90 * Spasm.Deg2Rad;
    return preset;
};

Spasm.CameraPresets.prototype.presetWeaponLarge = function () {
	var preset = {};
	preset.modelVertical = 0.05;
	preset.modelHorizontal = 0.4;
	preset.cameraDistance = 2.7;
	preset.cameraRotateVertical = 15.0 * Spasm.Deg2Rad;
    preset.cameraRotateHorizontal = -90 * Spasm.Deg2Rad;
	return preset;
};

Spasm.CameraPresets.prototype.presetWeaponRocket = function () {
	var preset = {};
	preset.modelVertical = 0.05;
	preset.modelHorizontal = 0;
	preset.cameraDistance = 3;
	preset.cameraRotateVertical = 15.0 * Spasm.Deg2Rad;
	return preset;
};

Spasm.CameraPresets.prototype.presetHeadArmor = function () {
	var preset = this.presetDefault();
	preset.modelVertical = 1.7;
	preset.modelHorizontal = 0.0;
	preset.cameraDistance = 1.2;
	return preset;
};

Spasm.CameraPresets.prototype.presetCloth = function () {
	var preset = this.presetDefault();
	preset.modelVertical = 1;
	preset.cameraDistance = 2.1;
	return preset;
};

Spasm.CameraPresets.prototype.presetHunterCloth = function () {
	var preset = this.presetDefault();
	preset.modelVertical = 1.2;
	preset.cameraDistance = 4.8;
	return preset;
};

Spasm.CameraPresets.prototype.presetLegArmor = function () {
	var preset = this.presetDefault();
	preset.modelVertical = 0.52;
	preset.modelHorizontal = 0.0;
	preset.cameraDistance = 6;
	return preset;
};

Spasm.CameraPresets.prototype.presetDefault = function () {
	var preset = {};
	preset.modelVertical = 1.3;
	preset.modelHorizontal = 0;
	preset.cameraDistance = 3;
	preset.cameraRotateHorizontal = -25 * Spasm.Deg2Rad;
	preset.cameraRotateVertical = 1.5 * Spasm.Deg2Rad;
	return preset;
};

Spasm.CameraPresets.prototype.presetShip = function()
{
    var preset = {};
    preset.modelVertical = 2.5;
    preset.modelHorizontal = 0;
    preset.cameraDistance = 35;
    preset.cameraRotateHorizontal = -25 * Spasm.Deg2Rad;
    preset.cameraRotateVertical = 20 * Spasm.Deg2Rad;
    return preset;
};
