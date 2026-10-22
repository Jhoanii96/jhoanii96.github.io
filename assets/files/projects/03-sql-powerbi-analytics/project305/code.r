# Leaflet with heatmap - Create an interactive map with intensity range and custom legend
m <- m %>%
	  leaflet::addMarkers(
		data = df_result,
		lat = ~Latitude,
		lng = ~Longitude,
		icon = ~icons[Tipo],
		label=lapply(paste("<p style='margin-top: 0px;margin-bottom: 0px;font-size:12px;padding:2px;border-radius: 0px;'>", df_result$tooltip ,"</p>", sep = ""), htmltools::HTML)
	  )
	  
	addLegendCustom <- function(map, labels, colors, sizes = rep("12px", length(labels)), position = "topright", title = NULL, ...)
	{
		items_html <- mapply(function(lbl, sz, clrs) {
			paste0(
				"<li style='list-style: none; display: flex; align-items: center; margin-bottom:4px;'>",
				"<div style='width:", sz, "; height:", sz, "; margin-right: 6px; display: inline-block;'>",
					"<div style=\" 
						width:0; 
						height:0; 
						border-left:8px solid transparent; 
						border-right:8px solid transparent; 
						border-bottom:12px solid ", clrs, ";\"> 
					</div>",
				"</div>",
				"<span>", lbl, "</span>",
				"</li>"
			)
		}, lbl = labels, sz = sizes, clrs = colors, SIMPLIFY = TRUE, USE.NAMES = FALSE)
		
		# Wrap the <li> items in a <ul> container, plus optional title
		ul_html <- paste0(
			"</div>",
			if (!is.null(title)) paste0("<div style='font-weight:bold; margin-bottom:6px;'>", title, "</div>") else "",
			"<ul style='padding-left:0; margin:0;'>",
			paste(items_html, collapse = ""),
			"</ul>",
			"<div style='margin-top:10px;width:200px'>Diferencia absoluta entre la suma de los valores de suspension del lado izquierdo (frontal + trasera) y la suma del lado derecho (frontal + trasera) del camion. Este valor permite detectar condiciones anomalas en los caminos de acarreo.<div>",
			"</div>"
		)
	  
		addControl(map, html = ul_html, position = position, ...)
	}
	
	m <- m %>%
		addLegendCustom(
			position = "topright",
			title    = "BIAS",
			labels   = c(
				paste("Gestion: ", bias_gestion," - ", bias_advertencia, sep=""), 
				paste("Advertencia: ", bias_advertencia," - ", bias_accion, sep=""), 
				paste("Accion: >= ", bias_accion, sep="")
			),
			sizes    = c("14px", "14px", "14px"),
			colors    = c(color_gestion, color_advertencia, color_accion)
		)
		
	if (show_heatmap_bias) {
		m <- m %>%
			addHeatmap(lat = df_result$Latitude, 
					   lng = df_result$Longitude, 
					   max=50, 
					   radius=heat_radius, 
					   minOpacity=heat_opacity/100,
					   blur=heat_blur, 
					   #gradient=c("#000000", "#0000FF", "#FFFFFF"),
					   data = df_result$ValorBias)
	}