/****** Object:  View [CDPV6].[v_hist_cycle_hp_current_year_map_result]    Script Date: 9/11/2021 00:24:23 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER VIEW [CDPV6].[v_hist_cycle_hp_current_year_map_result] 
AS 
with FirstTable 
as( 
	
	select 
		
		 hc.[shiftindex] as [shiftindex]
		,hc.[Date_Hist_Dumps] as [Date_Hist_Dumps]
		,hc.[loc_hist_dumps] as [loc_hist_dumps] 

		,hc.[blast] as [blast] 
		,dump_coord.latitude as [latitud_hist_dumps] 
		,dump_coord.longitude as [longitud_hist_dumps] 

		,hc.[digloc_hploads] 
		,load_coord.latitude as [latitud_loads_tkl] 
		,load_coord.longitude as [longitud_loads_tkl] 
		
		,hc.[dumptons] as [dumptons] 
		,hc.[MaterialType] as [Load]

	from [CDPV6].[v_hist_cycle_hp_current_year_map] hc 
	OUTER APPLY ( select latitude, longitude from [dbo].[fn_utm2latlong] ((hc.[dump_gpsxtkd]+299799), (hc.[dump_gpsytkd]+6899617),19,'S') ) as dump_coord 
	OUTER APPLY ( select latitude, longitude from [dbo].[fn_utm2latlong] ((hc.[load_gpsxtkl]+299799), (hc.[load_gpsytkl]+6899617),19,'S') ) as load_coord
	
)
,SecondTable  
as( 
	
	
	SELECT 
	
		 bh.[shiftindex]
		,bh.[Date_Hist_Dumps] 
		,bh.[loc_hist_dumps]
		,bh.[blast] 
		,bh.[dumptons] 
		
		,[Latitud_HistDump]=(case when bh.latitud_hist_dumps < -28 then NULL else bh.latitud_hist_dumps end) 
		,[Longitud_HistDump]=(case when bh.latitud_hist_dumps < -28 then NULL else bh.longitud_hist_dumps end) 

		,[latitud_loads_tkl]=(case 
							when bh.[blast] LIKE '%F10-%' then (case when bh.[latitud_loads_tkl] < -27.503486 and bh.[latitud_loads_tkl] > -27.524841 then bh.[latitud_loads_tkl] else null end)  
							when bh.[blast] LIKE '%F20-%' then (case when bh.[latitud_loads_tkl] < -27.503486 and bh.[latitud_loads_tkl] > -27.524841 then bh.[latitud_loads_tkl] else null end)     
							else (case when bh.[latitud_loads_tkl] > -27.567465 and bh.[latitud_loads_tkl] < -27.474693 then bh.[latitud_loads_tkl] else null end)  
					 end) 
		,[longitud_loads_tkl]=(case 
							when bh.[blast] LIKE '%F10-%' then (case when bh.[longitud_loads_tkl] < -70.278861 and bh.[latitud_loads_tkl] > -70.300031 then bh.[longitud_loads_tkl] else null end)  
							when bh.[blast] LIKE '%F20-%' then (case when bh.[longitud_loads_tkl] < -70.278861 and bh.[latitud_loads_tkl] > -70.300031 then bh.[longitud_loads_tkl] else null end)     
							else (case when bh.[longitud_loads_tkl] > -70.343349 and bh.[longitud_loads_tkl] < -70.271514 then bh.[longitud_loads_tkl] else null end)   
					 end) 
		
		,[Location]=(case 
							when bh.[blast] LIKE '%F0-%' then 'Fase 0'  
							when bh.[blast] LIKE '%F9-%' then 'Fase 9'  
							when bh.[blast] LIKE '%F10-%' then 'Fase 10'   
							when bh.[blast] LIKE '%F11-%' then 'Fase 11'    
							when bh.[blast] LIKE '%F12-%' then 'Fase 12'    
							when bh.[blast] LIKE '%F20-%' then 'Fase 20'     
							when bh.[blast] LIKE '%F21-%' then 'Fase 21'     
							when REPLACE(bh.[blast], ' ', '-') LIKE '%ST-%' then 'Stockpile' 
							when REPLACE(bh.[blast], '_', '-') LIKE '%ST-%' then 'Stockpile' 
							when bh.[blast] = 'ALCAPARROSA' then 'Alcaparrosa' 
							when bh.[blast] = 'STOCK SANTOS' then 'Stock Santos' 
							else 'Uknown'
					 end) 

		,[Fase_Banco]=(case 
							when bh.[blast] LIKE '%F0-%' then SUBSTRING(bh.[blast], 1, NULLIF(CHARINDEX('-', bh.[blast], NULLIF(CHARINDEX('-', bh.[blast]), 0) + 1), 0) - 1)   
							when bh.[blast] LIKE '%F9-%' then SUBSTRING(bh.[blast], 1, NULLIF(CHARINDEX('-', bh.[blast], NULLIF(CHARINDEX('-', bh.[blast]), 0) + 1), 0) - 1)    
							when bh.[blast] LIKE '%F10-%' then SUBSTRING(bh.[blast], 1, NULLIF(CHARINDEX('-', bh.[blast], NULLIF(CHARINDEX('-', bh.[blast]), 0) + 1), 0) - 1)      
							when bh.[blast] LIKE '%F11-%' then SUBSTRING(bh.[blast], 1, NULLIF(CHARINDEX('-', bh.[blast], NULLIF(CHARINDEX('-', bh.[blast]), 0) + 1), 0) - 1)       
							when bh.[blast] LIKE '%F12-%' then SUBSTRING(bh.[blast], 1, NULLIF(CHARINDEX('-', bh.[blast], NULLIF(CHARINDEX('-', bh.[blast]), 0) + 1), 0) - 1)       
							when bh.[blast] LIKE '%F20-%' then SUBSTRING(bh.[blast], 1, NULLIF(CHARINDEX('-', bh.[blast], NULLIF(CHARINDEX('-', bh.[blast]), 0) + 1), 0) - 1)  
							when bh.[blast] LIKE '%F21-%' then SUBSTRING(bh.[blast], 1, NULLIF(CHARINDEX('-', bh.[blast], NULLIF(CHARINDEX('-', bh.[blast]), 0) + 1), 0) - 1)     
							
					 end) 
		,bh.[Load] 
	FROM FirstTable bh  
	where 0 = 0 
	
)
,ThirdTable as 
(

	select 
		
		 st.[Date_Hist_Dumps] 

		,[Loc_Origen]=(case 
							when st.[blast] LIKE '%F0-%' then concat('Fase 0', ' (', st.[blast], ')')    
							when st.[blast] LIKE '%F9-%' then concat('Fase 9', ' (', st.[blast], ')')    
							when st.[blast] LIKE '%F10-%' then concat('Fase 10', ' (', st.[blast], ')')    
							when st.[blast] LIKE '%F11-%' then concat('Fase 11', ' (', st.[blast], ')')     
							when st.[blast] LIKE '%F12-%' then concat('Fase 12', ' (', st.[blast], ')')     
							when st.[blast] LIKE '%F20-%' then concat('Fase 20', ' (', st.[blast], ')')      
							when st.[blast] LIKE '%F21-%' then concat('Fase 21', ' (', st.[blast], ')')      
							else st.[Location] 
					 end) 

		,[Latitud_Origen]=(case 
					when st.[Location] = 'Stockpile' then -27.5282586094198 
					when st.[Location] = 'Alcaparrosa' then -27.4915376137778 
					when st.[Location] = 'Stock Santos' and st.latitud_loads_tkl < -27.491245 and st.latitud_loads_tkl > -27.494005 then -27.4915376137778 
					when st.[Location] = 'Stock Santos' and st.latitud_loads_tkl < -27.527613 and st.latitud_loads_tkl > -27.529258 then -27.5286159998315 
					when st.[Location] = 'Stock Santos' and st.latitud_loads_tkl < -27.504752 and st.latitud_loads_tkl > -27.506770 then -27.5059180335177 
					else st.latitud_loads_tkl end)   

		,[Longitud_Origen]=(case 
					when st.[Location] = 'Stockpile' then -70.2954409678882 
					when st.[Location] = 'Alcaparrosa' then -70.3042215751804 
					when st.[Location] = 'Stock Santos' and st.longitud_loads_tkl < -70.301626 and st.longitud_loads_tkl > -70.304735 then -70.3042215751804   -- arriba
					when st.[Location] = 'Stock Santos' and st.longitud_loads_tkl < -70.294806 and st.longitud_loads_tkl > -70.296379 then -70.2956415729105	 -- abajo
					when st.[Location] = 'Stock Santos' and st.longitud_loads_tkl < -70.284023 and st.longitud_loads_tkl > -70.287635 then -70.2856743045260 
					else st.longitud_loads_tkl end)     
		
		,st.[loc_hist_dumps] as [Loc_Destination] 

		,[Latitud_Destino]=(case 
					when st.[loc_hist_dumps] = 'ST_CHANCADO' then -27.5280222292214	 
					when st.[loc_hist_dumps] = 'CH1' then -27.5271920792477	 
					when st.[loc_hist_dumps] = 'RELL FASE 11' then -27.5122181983107		
					else st.[Latitud_HistDump] end) 

		,[Longitud_Destino]=(case 
					when st.[loc_hist_dumps] = 'ST_CHANCADO' then -70.2952344730188 
					when st.[loc_hist_dumps] = 'CH1' then -70.2955904675096	 	
					when st.[loc_hist_dumps] = 'RELL FASE 11' then -70.2954556127386	
					else st.[Longitud_HistDump] end)     

		,st.[dumptons] as [dumptons] 
		     
		,[Color_Line]=(case 
							when st.[Location] = 'Fase 0' then '#ed213a' -- ROJO 
							when st.[Location] = 'Fase 9' then '#2193b0' -- BLUE 
							when st.[Location] = 'Fase 10' then '#c471ed' -- PURPLE   
							when st.[Location] = 'Fase 11' then '#ff4b2b' -- ORANGE    
							when st.[Location] = 'Fase 12' then '#1e9600' -- GREEN    
							when st.[Location] = 'Fase 20' then '#03001e' -- BLACK    
							when st.[Location] = 'Fase 21' then '#ee0979' -- PINK     
							when st.[Location] = 'Stockpile' then '#67b26f' -- MILD    
							when st.[Location] = 'Alcaparrosa' then '#fffc00' --AMARILLO CLARO  
							when st.[Location] = 'Stock Santos' then '#004e92' -- FROST 
					 end) 
		 ,st.[Load] 
		 ,st.[Location] as [Short_Location_Origen] 

	from SecondTable st 

)
,FourTable as 
(

	select 
		
		 tt.Date_Hist_Dumps   
		,tt.Loc_Origen 
		,avg(tt.Latitud_Origen) as [Latitud_Origen] 
		,avg(tt.Longitud_Origen) as [Longitud_Origen] 
		,tt.Loc_Destination 
		,avg(tt.Latitud_Destino) as [Latitud_Destino] 
		,avg(tt.Longitud_Destino) as [Longitud_Destino] 
		,sum(tt.dumptons) as [dumptons] 
		,tt.Color_Line 
		,(SELECT [dbo].[RemoveStringDuplicate] (string_agg(tt.[Load], ', '))) as [Load] 
		,tt.[Short_Location_Origen] 
	
	from ThirdTable tt 
	where 0 = 0 
		and tt.Latitud_Origen is not null 
		and tt.Latitud_Destino is not null 
		and tt.Longitud_Origen is not null 
		and tt.Longitud_Destino is not null 
		
		and tt.Loc_Origen <> 'Stock Santos'
	group by tt.Date_Hist_Dumps, tt.Loc_Origen, tt.Loc_Destination, tt.Color_Line, tt.[Short_Location_Origen]      
	
	UNION ALL 
	
	select 
	
		 tt.Date_Hist_Dumps  
		,tt.Loc_Origen 
		,tt.Latitud_Origen 
		,tt.Longitud_Origen 
		,tt.Loc_Destination 
		,tt.Latitud_Destino 
		,tt.Longitud_Destino 
		,tt.dumptons 
		,tt.Color_Line 
		,tt.[Load] 
		,tt.[Short_Location_Origen] 
	
	from ThirdTable tt 
	where 0 = 0 
		and tt.Latitud_Origen is not null 
		and tt.Latitud_Destino is not null 
		and tt.Longitud_Origen is not null 
		and tt.Longitud_Destino is not null 
		
		and tt.Loc_Origen = 'Stock Santos'  

)
,Result as 
(
	
	select 
		
		 format(CONVERT (datetime,convert(char(8),ft.Date_Hist_Dumps)), 'yyyy-MM-dd') as [Date_Hist_Dumps]  
		,ft.Loc_Origen 
		,(case when ft.Latitud_Origen > -27.567465 and ft.Latitud_Origen < -27.474693 then ft.Latitud_Origen else null end) as [Latitud_Origen]
		,(case when ft.Longitud_Origen > -70.343349 and ft.Longitud_Origen < -70.271514 then ft.Longitud_Origen else null end) as [Longitud_Origen] 
		,ft.Loc_Destination 
		,(case when ft.Latitud_Destino > -27.567465 and ft.Latitud_Destino < -27.474693 then ft.Latitud_Destino else null end) as [Latitud_Destino] 
		,(case when ft.Longitud_Destino > -70.343349 and ft.Longitud_Destino < -70.271514 then ft.Longitud_Destino else null end) as [Longitud_Destino] 
		,ft.dumptons 
		,ft.Color_Line 
		,ft.[Load] 
		,ft.[Short_Location_Origen] 
		,(select [dbo].[CalculateBearing](ft.Latitud_Origen,ft.Longitud_Origen,ft.Latitud_Destino,ft.Longitud_Destino)) as [Bearing]

	from FourTable ft 

)

select * from Result;


GO


