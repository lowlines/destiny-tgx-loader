// spasm_webgl_renderable_part.js

var Spasm = Spasm || {};

Spasm.RenderablePart = function(indexStart, indexCount, changeColorIndex, primitiveType, externalIdentifier, isCloth)
{
	Spasm.assertInteger(indexStart);
	Spasm.assertInteger(indexCount);
	Spasm.assertInteger(changeColorIndex);
	Spasm.assertInteger(primitiveType);
	Spasm.assertInteger(externalIdentifier);
	Spasm.assertBoolean(isCloth);

	this.indexStart = indexStart;
	this.indexCount = indexCount;
	this.changeColorIndex = changeColorIndex;
	this.primitiveType = primitiveType;
	this.externalIdentifier = externalIdentifier;
	this.isCloth = isCloth;

	var gearDyeSlot = 0;
	var usePrimaryColor = true;
	var useInvestmentDecal = false;

	switch (changeColorIndex)
	{
		case 0:
			gearDyeSlot = 0;
			break;
		case 1:
			gearDyeSlot = 0;
			usePrimaryColor = false;
			break;
		case 2:
			gearDyeSlot = 1;
			break;
		case 3:
			gearDyeSlot = 1;
			usePrimaryColor = false;
			break;
		case 4:
			gearDyeSlot = 2;
			break;
		case 5:
			gearDyeSlot = 2;
			usePrimaryColor = false;
			break;
		case 6:
			gearDyeSlot = 3;
			useInvestmentDecal = true;
			break;
		case 7:
			gearDyeSlot = 3;
			useInvestmentDecal = true;
			break;
		default:
			Spasm.assert(false, "unsupported change color index: " + changeColorIndex);
			break;
	}

	this.gearDyeSlot = gearDyeSlot;
	this.usePrimaryColor = usePrimaryColor;
	this.useInvestmentDecal = useInvestmentDecal;
};
