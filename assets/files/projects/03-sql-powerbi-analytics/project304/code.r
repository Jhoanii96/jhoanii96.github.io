fig <- plot_ly(type = 'parcoords', line = line, dimensions = dimensions) %>%
  layout(
    title = list(
      text = "<b>Parallel plot - Flotation's operational trajectories (end-to-end), 2023 - 2024 - Part I: Ore feed + SAG + Ball mill circuits</b>",
      font = list(family = "Calibri", size = 20)
    ),
    margin = list(l = 60, r = 60, t = 60, b = 60)
  )