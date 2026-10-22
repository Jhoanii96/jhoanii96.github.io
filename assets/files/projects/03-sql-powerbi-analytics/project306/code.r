# Heatmap Spearman - Create a kernel density scatter plot using ggplot2
kde_scatter_plot <- ggplot(data, aes(x = Value_X, y = Value_Y)) + 
    geom_point(aes(color = Value_X), alpha = 0.6, show.legend = FALSE) + 
    scale_color_viridis_c(option="turbo") + 
    scale_fill_viridis_c() + 
    stat_density_2d(geom = "polygon", aes(fill = ..level..), alpha = 0.5, contour = TRUE) + 
    geom_smooth(method = "auto", se = FALSE, color = "darkorange4", linetype = "solid", size = 1) + # Add linear regression line
    # Max Limit
    geom_segment(x=value_x_min,xend=value_x_max,y=limit_y_max,yend=limit_y_max, linewidth=0.5, colour="midnightblue") + 
    # Min Limit
    geom_segment(x=value_x_min,xend=value_x_max,y=limit_y_min,yend=limit_y_min, linewidth=0.5, colour="midnightblue") + 

    geom_segment(x= limit_x_min,xend= limit_x_min,y=value_y_min,yend=value_y_max, linewidth=0.5, colour="midnightblue", linetype="dashed") + 
    geom_segment(x= limit_x_max,xend= limit_x_max,y=value_y_min,yend=value_y_max, linewidth=0.5, colour="midnightblue", linetype="dashed") + 

    labs(
      x = value_x_name,
      y = value_y_name,
      color = ""
    ) + 
    scale_x_continuous(limits = c(value_x_min, value_x_max), breaks = seq(value_x_min, value_x_max, value_x_seq), sec.axis = sec_axis(~ ., breaks = seq(value_x_min, value_x_max, value_x_seq))) + 
    scale_y_continuous(limits = c(value_y_min, value_y_max), 
                       breaks = round(seq(value_y_min, value_y_max, value_y_seq), digits = 0),  
                       sec.axis = sec_axis(~ ., breaks = round(seq(value_y_min, value_y_max, value_y_seq), digits = 0))) + 
    theme_minimal() +  
    theme(legend.position="none")  
    
  p2 <- ggplot(data, aes(x=Value_X,colour=factor(value_x_name),fill=factor(value_x_name))) + 
    geom_density(alpha=1, colour = "#000080", fill = "midnightblue") + 
    scale_x_continuous(labels = NULL, limits = c(value_x_min, value_x_max), breaks = seq(value_x_min, value_x_max, value_x_seq), expand=c(0.02,0)) + 
    scale_y_continuous(breaks=NULL,expand=c(0.02,0)) +
    theme_bw() +
    labs(
      title = plot_title_value
    ) +
    theme0(
        plot.title = element_text(hjust = 0.5),
        plot.margin = unit(c(1,2,0,2.2),"lines")
    ) 
  
  p3 <- ggplot(data, aes(x=Value_Y,colour=factor(value_y_name),fill=factor(value_y_name))) + 
    geom_density(alpha=1, colour = "#000080", fill = "midnightblue") + 
    coord_flip()  + 
    scale_x_continuous(labels = NULL, limits = c(value_y_min, value_y_max), breaks = seq(value_y_min, value_y_max, value_y_seq), expand=c(0.02,0)) +
    scale_y_continuous(labels = NULL, breaks=NULL, expand=c(0.02,0)) +
    theme_bw() +
    theme0(plot.margin = unit(c(2,1,2.7,0),"lines"))
  
  grid.arrange(arrangeGrob(p2,ncol=2,widths=c(7,1)),
               arrangeGrob(kde_scatter_plot,p3,ncol=2,widths=c(7,1)),
               heights=c(1,7))