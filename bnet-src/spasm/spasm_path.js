// spasm_path.js

var Spasm = Spasm || {};

Spasm.Path = {};

Spasm.Path.stripLeadingSlash = function(path)
{
	Spasm.assertPath(path);

	var pathLength = path.length;
	var strippedPath;
	if (pathLength > 0)
	{
		strippedPath = path[0] === "/" ? path.substring(1, path.length) : path;
	}
	else
	{
		strippedPath = path;
	}

	return strippedPath;
};

Spasm.Path.stripTrailingSlash = function(path)
{
	Spasm.assertPath(path);

	var pathLength = path.length;
	
	var strippedPath;
	if (pathLength > 0)
	{
		strippedPath = (path[pathLength - 1] === "/"
			? path.substring(0, path.length - 1)
			: path);
	}
	else
	{
		strippedPath = path;
	}

	return strippedPath;
};

Spasm.Path.combine = function(path0, path1)
{
	Spasm.assertPath(path0);
	Spasm.assertPath(path1);

	var combinedPath = Spasm.Path.stripTrailingSlash(path0) + "/" + Spasm.Path.stripLeadingSlash(path1);
	return combinedPath;
};

Spasm.Path.addVersionQuery = function(path)
{
	return Spasm.Content.VersionQuery ? path + "?" + Spasm.Content.VersionQuery : path;
};

Spasm.assertEqual(Spasm.Path.stripLeadingSlash("/a/"), "a/");
Spasm.assertEqual(Spasm.Path.stripTrailingSlash("/b/"), "/b");
Spasm.assertEqual(Spasm.Path.combine("/c/", "/d/"), "/c/d/");
