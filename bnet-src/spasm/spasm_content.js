// spasm_content.js

var Spasm = Spasm || {};

Spasm.Content = {};

Spasm.Content.setContentBaseURL = function(contentBaseURLWithQuery)
{
	Spasm.assertString(contentBaseURLWithQuery);
	
	var contentBaseURLQuerySplit = contentBaseURLWithQuery.split("?");
	var contentBaseURL = contentBaseURLQuerySplit[0];
	var versionQuery = contentBaseURLQuerySplit.length > 1 ? contentBaseURLQuerySplit[1] : null;

	Spasm.Content.BaseURL = contentBaseURL;
	Spasm.Content.VersionQuery = versionQuery;

	Spasm.Content.RootPath = Spasm.Path.combine(contentBaseURL, "/common/destiny_content/geometry/");
	Spasm.Content.ContentPath = Spasm.Content.RootPath;

	Spasm.Content.StaticPath = contentBaseURL;

	// platform-agnostic content

	Spasm.Content.AnimationsPath = Spasm.Path.combine(contentBaseURL, "/common/destiny_content/animations/");
	Spasm.Content.TablesPath = Spasm.Content.StaticPath;

	Spasm.Content.GearDirectory = "gear/";
	Spasm.Content.GearPath = Spasm.Path.combine(Spasm.Content.ContentPath, Spasm.Content.GearDirectory);

	// platform path

	Spasm.Content.PlatformDirectory = "platform/";
	Spasm.Content.PlatformPath = Spasm.Path.combine(Spasm.Content.ContentPath, Spasm.Content.PlatformDirectory);

	Spasm.Content.WebDirectory = "web/";
	Spasm.Content.WebPath = Spasm.Path.combine(Spasm.Content.PlatformPath, Spasm.Content.WebDirectory);

	// platform-specific content

	Spasm.Content.GeometryDirectory = "geometry/";
	Spasm.Content.GeometryPath = Spasm.Path.combine(Spasm.Content.WebPath, Spasm.Content.GeometryDirectory);

	Spasm.Content.TexturesDirectory = "textures/";
	Spasm.Content.TexturesPath = Spasm.Path.combine(Spasm.Content.WebPath, Spasm.Content.TexturesDirectory);

	Spasm.Content.PlatedTexturesDirectory = "plated_textures/";
	Spasm.Content.PlatedTexturesPath = Spasm.Path.combine(Spasm.Content.WebPath, Spasm.Content.PlatedTexturesDirectory);
};
