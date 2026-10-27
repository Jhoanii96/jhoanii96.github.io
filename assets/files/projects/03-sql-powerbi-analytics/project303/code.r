graph <- ggplot(NULL, aes(x_axis,P_Size, color=average$blast, group=1, text=paste0('Promedio: ', round(average$P_Size, 1), '%'))) + 
  #graph <- ggplotly(average$blast, tooltip = average$blast)) + 
  #creacion de lineas auxiliares
  geom_vline( xintercept = 25400, col='red', lwd=0.25, linetype="dotted") +
  geom_hline( yintercept = 43, col='red', lwd=0.25, linetype="dotted") +
  geom_vline( xintercept = 1000, col='Gray', lwd=0.25) +
  geom_vline( xintercept = 10000, col='Gray', lwd=0.25) +
  geom_vline( xintercept = 100000, col='Gray', lwd=0.25) +
  geom_vline( xintercept = 100000, col='Gray', lwd=0.25) +
  geom_vline( xintercept = 1000000, col='Gray', lwd=0.25) +
  geom_vline( xintercept = 10000000, col='Gray', lwd=0.25) +
  geom_line(data=average)  +
  geom_line(data=target , col="black", lwd = 0.25, lty = 5)  +
  scale_x_log10(labels = comma)+
  scale_y_continuous(breaks=seq(0, 100, 10))+
  #Personalizacion de la grafica
  labs(x="Malla de Micrones", y="Pasante Acumulado %",color=" ") +
  geom_point(data=average,size=2, shape=21, fill="White") +
  theme_bw()+
  theme(plot.background = element_rect(fill =rgb(230, 230, 230, maxColorValue = 255)))+
  theme (axis.text.x = element_text(face="bold", colour="ivory4", size=rel(1.0)),axis.text.y = element_text(face="bold", colour="ivory4", size=rel(1.0), angle=90, hjust=0.5),
         axis.title.x = element_text(face="bold", colour="gray39", size=rel(1.0)),
         axis.title.y = element_text(face="bold", colour="gray39", size=rel(1.0)),
         legend.title = element_text(colour="gray39", size=12,face="bold"),
         legend.position = "Top",
         legend.text = element_text(colour="Black", size=9),
         legend.background =element_rect(fill =rgb(230,230,230, maxColorValue = 255)))
#visualizacion de la grafica

####################################################

############# Create and save widget ###############

fig <- ggplotly(graph, tooltip = "text") %>% layout(legend = list(orientation = "h", 
                                                                  xanchor = "center",  # use center of legend as anchor
                                                                  x = 0.5, 
                                                                  y = -0.15,
                                                                  borderwidth = 1,
                                                                  tracegroupgap = 0, 
                                                                  font = list(size = 10, color = "#000")
),
margin = list(l = 5, r = 5, b = 5, t = 5), 
xaxis = list(autorange = TRUE, title = list(standoff=7)),
yaxis = list(autorange = TRUE, title = list(standoff=7))
)

fig$sizingPolicy$padding <- "0" 

fig