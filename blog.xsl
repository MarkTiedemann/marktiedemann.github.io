<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="posts">
		<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
			<head>
				<title>mark's web.site</title>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
				<meta name="description" content="Mark's personal web.site."/>
				<meta name="author" content="Mark Tiedemann"/>
				<style type="text/css">
					html { display: flex; }
					body { background: #20202a; color: white; line-height: 1.2em; margin: 2em auto; padding: 0 1em; max-width: 60ch; }
					table { margin: auto; padding-right: 1em; line-height: 1.4em; }
					td { font-size: 1.1em; }
					img { border-radius: 50%; max-height: 66px; margin-right: 1em; }
					a { text-decoration: none; color: #44bdff; }
					a:hover { text-decoration: underline; }
				</style>
			</head>
			<body>
				<table>
					<tr>
						<td>
							<img src="index.jpg"/>
						</td>
						<td>
							<b>Hi, I'm Mark.</b><br/>
							Welcome to my website!
						</td>
					</tr>
				</table>
				<br/>
				<xsl:for-each select="post">
					<!-- posts without a date are considered drafts and won't be listed -->
					<xsl:if test="date != ''">
						<xsl:value-of select="date"/> - <a href="{slug}"><xsl:value-of select="title"/></a><br/>
						<i><xsl:value-of select="desc"/></i><br/>
						<br/>
					</xsl:if>
				</xsl:for-each>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
