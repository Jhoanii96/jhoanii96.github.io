m <- leaflet()
m <- m %>% addTiles("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}")

#IconCrusher icon
IconCrusher <- makeIcon(
  iconUrl = "...",
  iconWidth = 60, 
  iconAnchorX = 22, iconAnchorY = 15 
)
#StockpileStockSantos Icon  thenounproject 1190108 Blue DUNE
IconStockpileStockSantos <- makeIcon(
  iconUrl = "...",
  iconWidth = 40, 
  iconAnchorX = 20, iconAnchorY = 20 
)
#Chancador Icon thenounproject 1406707  red   ALMACEN CHANCADOR
IconChancador <- makeIcon(
  iconUrl = "...",
  iconWidth = 30, 
  iconAnchorX = 16, iconAnchorY = 25 
)

#Truck ORIGEN Icon thenounproject 3484564 BLUE 
IconBlueTruck <- makeIcon(
  iconUrl = "...",
  iconWidth = 30, 
  iconAnchorX = 14, iconAnchorY = 20 
)

#Truck destination Icon thenounproject 3484564 RED 
IconRedTruck <- makeIcon(
  iconUrl = "...",
  iconWidth = 30, 
  iconAnchorX = 14, iconAnchorY = 20 
)


new_icon <- "" 


for(i in 1:length(new_table_latlon[, 1])){
  
  if (grepl("CH1", new_table_latlon[i, 3], fixed=TRUE)) {
    new_icon <- IconChancador 
    
  } else if (grepl("Stockpile", new_table_latlon[i, 3], fixed=TRUE) || grepl("Stock Santos", new_table_latlon[i, 3], fixed=TRUE) && grepl("Origin", new_table_latlon[i, 4], fixed=TRUE)) {
    new_icon <- IconStockpileStockSantos 
  
  } else { 
    
    if (grepl("Origin", new_table_latlon[i, 4], fixed=TRUE)) {
      new_icon <- IconBlueTruck 
      
    }
    
    if (grepl("Destination", new_table_latlon[i, 4], fixed=TRUE)) {
      new_icon <- IconRedTruck 
      
    }
    
  }
  
  m <- addMarkers(m, lng=new_table_latlon[i, 2], lat=new_table_latlon[i, 1], label=lapply(paste0(paste("<p style='margin-top: 0px;margin-bottom: 0px;'>", new_table_latlon[i, 4], ": ", new_table_latlon[i, 3], "<br>Latitud: ", substring(new_table_latlon[i, 1], 1, 10), "<br>Longitud: ", substring(new_table_latlon[i, 2], 1, 10), "</p>")), htmltools::HTML), icon = new_icon)
  
} 

weight_size <- 0 


for(i in 1:length(result[, 1])){
  
  if(result[i, 8]/10000 < 3) {
    weight_size <- 2 
  } else if (result[i, 8]/10000 > 10) {
    weight_size <- 10 
  } else {
    weight_size <- result[i, 8]/10000 
  }  
  
  IconSet <- makeAwesomeIcon(icon= 'ios-arrow-up', markerColor = 'green', iconColor = result[i, 9], library = "ion", iconRotate = result[i, 12])
  
  m <- m %>% 
      addPolylines(lng = c(result[i, 4],result[i, 7]), lat = c(result[i, 3],result[i, 6]), weight = weight_size, label = lapply(paste0("<p style='margin-top: 0px;margin-bottom: 0px;'>Origin: ",result[i, 2],"<br>Destination: ",result[i, 5],"<br>Tonnage: ", comma(round(result[i, 8]), digits = 0),"</p>"), htmltools::HTML), color = result[i, 9])
  
  m <- m %>%
    addAwesomeMarkers(lng = result[i, 7], lat = result[i, 6], icon = IconSet)
  
  
} 

m <- m %>% addLabelOnlyMarkers(lat = -27.491344, lng = -70.304495, label = lapply(paste0("<p style='text-align:center;margin-top: 0px;margin-bottom: 0px;'><b><a href='javascript:;'>Stock Santos</a></b><br>Tonnage: ",comma(round(ton_stocksantos_total), digits = 0),"<br><b><a href='javascript:;'>Alcaparrosa</a></b><br>Tonnage: ",comma(round(ton_alcaparrosa_total), digits = 0),"</p>"), htmltools::HTML),
                               labelOptions = labelOptions(noHide = T, textsize = "12px", direction = "right", opacity = 0.7,  offset = c(20, -15))
)
m <- m %>% addLabelOnlyMarkers(lat = -27.507622, lng = -70.291500, label = lapply(paste0("<p style='text-align:center;margin-top: 0px;margin-bottom: 0px;'><b><a href='javascript:;'>Fase 11</a></b><br>Tonnage: ",comma(round(ton_fase11_total), digits = 0),"</p>"), htmltools::HTML),
                               labelOptions = labelOptions(noHide = T, textsize = "12px", direction = "right", opacity = 0.7,  offset = c(20, -15))
)
m <- m %>% addLabelOnlyMarkers(lat = -27.518672, lng = -70.289454, label = lapply(paste0("<p style='text-align:center;margin-top: 0px;margin-bottom: 0px;'><b><a href='javascript:;'>Fase 10</a></b><br>Tonnage: ",comma(round(ton_fase10_total), digits = 0),"</p>"), htmltools::HTML),
                               labelOptions = labelOptions(noHide = T, textsize = "12px", direction = "right", opacity = 0.7,  offset = c(20, -15))
)
m <- m %>% addLabelOnlyMarkers(lat = -27.522586, lng = -70.289583, label = lapply(paste0("<p style='text-align:center;margin-top: 0px;margin-bottom: 0px;'><b><a href='javascript:;'>Fase 0</a></b><br>Tonnage: ",comma(round(ton_fase0_total), digits = 0),"</p>"), htmltools::HTML),
                               labelOptions = labelOptions(noHide = T, textsize = "12px", direction = "right", opacity = 0.7,  offset = c(20, -15))
)
m <- m %>% addLabelOnlyMarkers(lat = -27.521967, lng = -70.295715, label = lapply(paste0("<p style='text-align:center;margin-top: 0px;margin-bottom: 0px;'><b><a href='javascript:;'>Fase 12</a></b><br>Tonnage: ",comma(round(ton_fase12_total), digits = 0),"</p>"), htmltools::HTML),
                               labelOptions = labelOptions(noHide = T, textsize = "12px", direction = "right", opacity = 0.7,  offset = c(20, -15))
)
m <- m %>% addLabelOnlyMarkers(lat = -27.528213, lng = -70.295076, label = lapply(paste0("<p style='text-align:center;margin-top: 0px;margin-bottom: 0px;'><b><a href='javascript:;'>Stockpile</a></b><br>Tonnage: ",comma(round(ton_stockpile_total), digits = 0),"</p>"), htmltools::HTML),
                               labelOptions = labelOptions(noHide = T, textsize = "12px", direction = "right", opacity = 0.7,  offset = c(20, -15))
)

m <- m %>% addLegend("bottomright",  
                     colors =c("#004e92", "#ed213a"),
                     labels= c("Origin", "Destination"),
                     title= paste("Position Truck | ", Date_SE),
                     opacity = 1)


m <- m %>% addLegend("bottomright",  
                colors =c("#ed213a", "#2193b0", "#c471ed", "#ff4b2b", "#1e9600", "#03001e", "#ee0979", "#67b26f", "#fffc00", "#004e92"),
                labels= c("Fase 0", "Fase 9","Fase 10","Fase 11","Fase 12","Fase 20","Fase 21","Stockpile","Alcaparrosa","Stock Santos"),
                title= paste("Location from to"),
                opacity = 1)


new_map <- browsable(
  tagList(list(
    tags$head(
      # you'll need to be very specific
      tags$style("
body
{
    margin: 0px;
    padding: 0px;
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
.awesome-marker-shadow
{
    background: none;
}
.awesome-marker
{
    background: none;
}
.leaflet
{
    width: 100% !important;
    height: 100% !important;
    position: relative;
    outline: none;
}
.awesome-marker i {
    font-size: 50px !important; 
    margin-top: 10px !important;
    margin-right: 2px !important;
}
.leaflet-marker-icon
{
    z-index: 10000 !important; 
}")
    ),
    m
  ))
)


new_map
