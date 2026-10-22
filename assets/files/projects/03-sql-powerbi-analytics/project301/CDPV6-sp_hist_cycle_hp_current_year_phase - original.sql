
ALTER PROCEDURE [CDPV6].[sp_hist_cycle_hp_current_year_phase] 
AS 

If object_id('tempdb..#Temp') is not null 
    drop table #Temp 

If object_id('tempdb..#Split_LMLP') is not null
    drop table #Split_LMLP 

If object_id('tempdb..#hist_cycle_hp') is not null
    drop table #hist_cycle_hp 

If object_id('tempdb..#hist_cycle_hp_budyup') is not null
    drop table #hist_cycle_hp_budyup 

CREATE TABLE #Split_LMLP (
	[TSP] [datetime] NULL,
	[P50] [float] NULL,
	[P80] [float] NULL,
	[TS] [float] NULL,
	[S1_000] [float] NULL,
	[S4_000] [float] NULL,
	[Side] [int] NULL 
)

INSERT INTO #Split_LMLP ([TSP], [P50], [P80], [TS], [S1_000], [S4_000], [Side]) 
SELECT 
	[TSP], round([P50], 3) as [P50], round([P80], 3) as [P80], round([TS], 3) as [TS], [S1_000], [S4_000], [Side]=1 
FROM [CDSP].[LP] WHERE format([TSP], 'yyyy') = format(getdate(), 'yyyy')  

INSERT INTO #Split_LMLP ([TSP], [P50], [P80], [TS], [S1_000], [S4_000], [Side]) 
SELECT 
	[TSP], round([P50], 3) as [P50], round([P80], 3) as [P80], round([TS], 3) as [TS], [S1_000], [S4_000], [Side]=2 
FROM [CDSP].[LM] WHERE format([TSP], 'yyyy') = format(getdate(), 'yyyy')  

CREATE NONCLUSTERED INDEX [IX_Split_LMLP] ON #Split_LMLP ([TSP],[Side]); 

CREATE TABLE #hist_cycle_hp (
	   [shiftindex] [int] NULL 
      ,[truck] [nvarchar](256) NULL 
      ,[loc_hist_dumps] [nvarchar](256) NULL 
      ,[excav] [nvarchar](256) NULL 
      ,[blast] [nvarchar](256) NULL 
      ,[eoper] [nvarchar](256) NULL 
	  ,[dumptons] [float] NULL 
      ,[TimeArrive_Hd] [time](7) NULL 
      ,[DateTimeArrive_Hd] [datetime] NULL 
      ,[TimeDump_Hd] [time](7) NULL 
      ,[DateTimeDump_Hd] [datetime] NULL 
      ,[TimeEmpty_Hd] [time](7) NULL 
      ,[DateTimeEmpty_Hd] [datetime] NULL 
      ,[TimeMinutesArriveToDump] [numeric](19,7) NULL 
      ,[TimeMinutesDumpToEmpy] [numeric](19,7) NULL 
      ,[gpsxtkd] [float] NULL 
      ,[gpsytkd] [float] NULL 
      ,[gpsvel] [float] NULL 
      ,[gpsxtkl] [float] NULL 
      ,[gpsytkl] [float] NULL 
      ,[gpsveltk] [float] NULL 
      ,[digloc_hploads] [nvarchar](256) NULL 
      ,[facex] [float] NULL 
      ,[facey] [float] NULL 
	  ,[facez] [float] NULL 
)

INSERT INTO #hist_cycle_hp ([shiftindex],[truck],[loc_hist_dumps],[excav],[blast],[eoper],[dumptons],[TimeArrive_Hd],[DateTimeArrive_Hd]
	,[TimeDump_Hd],[DateTimeDump_Hd],[TimeEmpty_Hd],[DateTimeEmpty_Hd],[TimeMinutesArriveToDump],[TimeMinutesDumpToEmpy]
	,[gpsxtkd],[gpsytkd],[gpsvel],[gpsxtkl],[gpsytkl],[gpsveltk],[digloc_hploads],[facex],[facey],[facez]) 
SELECT * FROM [CDPV6].[fn_hist_cycle_hp_current_year] (); 

CREATE NONCLUSTERED INDEX [IX_hist_cycle_hp] ON #hist_cycle_hp ([DateTimeEmpty_Hd],[truck]); 

;with ZeroTable 
as( 

	select 
		
		 hc.shiftindex 
		,hc.[truck] 
		,hc.[loc_hist_dumps]
		,hc.[excav] 
		,hc.[blast] 
		,hc.[dumptons] 
		,hc.[TimeArrive_Hd] 
		,hc.[DateTimeArrive_Hd] 
		,hc.[TimeDump_Hd] 
		,hc.[DateTimeDump_Hd] 
		,hc.[TimeEmpty_Hd]
		,hc.[DateTimeEmpty_Hd] 
		,hc.[TimeMinutesArriveToDump] 
		,hc.[TimeMinutesDumpToEmpy] 
		
		,hc.[gpsvel] 

		,(select latitude from [CDPV].[fn_utm_latlong] ((hc.[gpsxtkl]+299799), (hc.[gpsytkl]+6899617),19,'S')) as [latitud_loads_tkl] 
		,(select longitude from [CDPV].[fn_utm_latlong] ((hc.[gpsxtkl]+299799), (hc.[gpsytkl]+6899617),19,'S')) as [longitud_loads_tkl] 
		
		,hc.[digloc_hploads] 
		
		,(select latitude from [CDPV].[fn_utm_latlong] (((hc.[facex]/100)+299799), ((hc.[facey]/100)+6899617),19,'S')) as [latitud_loads_face] 
		,(select longitude from [CDPV].[fn_utm_latlong] (((hc.[facex]/100)+299799), ((hc.[facey]/100)+6899617),19,'S')) as [longitud_loads_face] 
		
		,Lado=(case when (select longitude from [CDPV].[fn_utm_latlong] ((hc.[gpsxtkd]+299799), (hc.[gpsytkd]+6899617),19,'S')) < -70.295652 then 1 else 2 end)

		,bu.[DateTime] as [DateTime_BodyUp]
		,bu.[Equipment] as [Equipment_BodyUp] 
		,hc.[eoper] 

		,hc.[facex] as [GPSFacex] 
		,hc.[facey] as [GPSFacey] 
		,case when hc.[facez] is null then 0 else hc.[facez] end as [GPSFacez] 

	from #hist_cycle_hp hc 
	left join [CDPI].[PI_Body_Up_Structure] bu 
	on CONVERT(DATETIME,hc.[DateTimeEmpty_Hd],101) between DATEADD(S, -120, CONVERT(DATETIME,bu.[DateTime],101)) and DATEADD(S, 85, CONVERT(DATETIME,bu.[DateTime],101)) 
	and hc.[truck] = bu.[Equipment] and bu.[Status] IN ('On', 'Up') 
	
)

SELECT * INTO #hist_cycle_hp_budyup FROM ZeroTable; 
CREATE NONCLUSTERED INDEX [IX_hist_cycle_hp_budyup] ON #hist_cycle_hp_budyup (DateTimeEmpty_Hd, [Lado]); 

;with FirstTable  
as( 
	
	
	SELECT 
		
		 bh.shiftindex 
		,sl.[TSP] as [DateTimeSplit] 
		,format(dateadd(hour, 4, sl.[TSP]), 'yyyy-MM-dd') as [DateSplit] 
		,[TimeMinutesSplitToEmpty]=ABS(Datediff(s, bh.[DateTimeEmpty_Hd], sl.[TSP]))*1.0000/60  
		,sl.P80 
		,sl.P50 
		,sl.TS 
		,sl.[S1_000] 
		,sl.[S4_000] 
		,(case when sl.Side = 1 then 'LP' else 'LM' end) as [LadoSplit]  
		
		,bh.[truck] 
		,bh.[loc_hist_dumps] 
		,bh.[excav] 
		,bh.[blast] 
		,bh.[dumptons] 
		,bh.[DateTimeArrive_Hd]
		,bh.[TimeMinutesArriveToDump]  
		,bh.[DateTimeDump_Hd]
		,bh.[TimeMinutesDumpToEmpy]  
		,bh.[DateTimeEmpty_Hd] 
		
		,bh.gpsvel 
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
		,bh.[GPSFacex]
		,bh.[GPSFacey]
		,bh.[GPSFacez] 
		,[latitud_loads_face]=(case 
							when bh.[blast] LIKE '%F10-%' then (case when bh.[latitud_loads_face] < -27.503486 and bh.[latitud_loads_face] > -27.524841 then bh.[latitud_loads_face] else null end)  
							when bh.[blast] LIKE '%F20-%' then (case when bh.[latitud_loads_face] < -27.503486 and bh.[latitud_loads_face] > -27.524841 then bh.[latitud_loads_face] else null end)     
							else (case when bh.[latitud_loads_face] > -27.567465 and bh.[latitud_loads_face] < -27.474693 then bh.[latitud_loads_tkl] else null end)  
					 end) 
		,[longitud_loads_face]=(case 
							when bh.[blast] LIKE '%F10-%' then (case when bh.[longitud_loads_face] < -70.278861 and bh.[longitud_loads_face] > -70.300031 then bh.[longitud_loads_face] else null end)  
							when bh.[blast] LIKE '%F20-%' then (case when bh.[longitud_loads_face] < -70.278861 and bh.[longitud_loads_face] > -70.300031 then bh.[longitud_loads_face] else null end)     
							else (case when bh.[longitud_loads_face] > -70.343349 and bh.[longitud_loads_face] < -70.271514 then bh.[longitud_loads_face] else null end)   
					 end) 
		
		,bh.digloc_hploads 
		,bh.[DateTime_BodyUp] 
		,bh.[Equipment_BodyUp]  
		,bh.[eoper] 

	FROM #Split_LMLP sl  
	LEFT JOIN #hist_cycle_hp_budyup bh  
	ON (bh.DateTimeEmpty_Hd between DATEADD(S, -360, sl.[TSP]) and DATEADD(S, 85, sl.[TSP])) and sl.Side = bh.Lado 
	
)

SELECT * INTO #Temp FROM FirstTable; 
CREATE NONCLUSTERED INDEX NCL_temp ON #Temp ([DateTimeSplit],[TimeMinutesSplitToEmpty]);

;with AuxTable as 
(
	
	select 
		bu.[DateTimeSplit], 
		MIN(bu.TimeMinutesSplitToEmpty) as [TimeMinutesSplitToEmpty] from #Temp bu 
	where bu.[TimeMinutesSplitToEmpty] is not null 
	group by bu.DateTimeSplit 

)
,SecondTable as 
(
	
	select ft.*, row_number() over (partition by ft.DateTimeSplit order by ft.DateTimeSplit desc) as seqnum from #Temp ft 
	inner join AuxTable axt (nolock) 
	on axt.DateTimeSplit = ft.DateTimeSplit and axt.[TimeMinutesSplitToEmpty] = ft.[TimeMinutesSplitToEmpty]   
	
)
,ThirstTable as 
(
	select st.* from SecondTable st where st.seqnum = 1   
	union
	select tt.*, seqnum=1 from #Temp tt where tt.[TimeMinutesSplitToEmpty] is null   
) 
,FourTable as 
(
	
	select 
		
		 th.[DateTimeSplit] 
		,th.[DateSplit] 
		,th.[TimeMinutesSplitToEmpty] 
		,th.P80 
		,th.P50 
		,th.TS 
		,th.[S1_000] 
		,th.[S4_000] 
		,th.[LadoSplit]  
		,th.[truck] 
		,th.[loc_hist_dumps] 
		,th.[excav] 
		,th.[dumptons] 
		,[blast]=(case 
							when th.[blast] LIKE '%F0-%' then 'Fase 0'   
							when th.[blast] = 'Alcaparrosa' then 'Stock Punto B' 
							when th.[blast] = 'Stock Santos' then 'Stock Punto B' 
							else th.[blast]
					 end) 
		,th.[DateTimeArrive_Hd]
		,th.[TimeMinutesArriveToDump]  
		,th.[DateTimeDump_Hd]
		,th.[TimeMinutesDumpToEmpy]  
		,th.[DateTimeEmpty_Hd] 
		
		,th.[gpsvel] 
		,[latitud_loads_tkl]=(case when th.[longitud_loads_tkl] is null then null else th.[latitud_loads_tkl] end) 
		,[longitud_loads_tkl]=(case when th.[latitud_loads_tkl] is null then null else th.[longitud_loads_tkl] end) 
		
		,th.[GPSFacex]
		,th.[GPSFacey]
		,th.[GPSFacez] 
		,[latitud_loads_face]=(case when th.[latitud_loads_face] is null then 
									(case when th.[latitud_loads_tkl] is null 
									then null 
									else (case when th.[longitud_loads_tkl] is null then null else th.[latitud_loads_tkl] end) end) 
								else th.[latitud_loads_face] end) 
		,[longitud_loads_face]=(case when th.[longitud_loads_face] is null then 
									(case when th.[longitud_loads_tkl] is null 
									then null 
									else (case when th.[latitud_loads_tkl] is null then null else th.[longitud_loads_tkl] end) end) 
								else th.[longitud_loads_face] end) 
		,th.digloc_hploads 
		
		,th.[DateTime_BodyUp] 
		,th.[Equipment_BodyUp]  
		,th.[eoper] 

		,[Location]=(case 
							when th.[blast] LIKE '%F0-%' then 'Candelaria UG'  
							when th.[blast] LIKE '%F9-%' then 'Fase 9'  
							when th.[blast] LIKE '%F10-%' then 'Fase 10'   
							when th.[blast] LIKE '%F11-%' then 'Fase 11'    
							when th.[blast] LIKE '%F12-%' then 'Fase 12'    
							when th.[blast] LIKE '%F20-%' then 'Fase 20'     
							when th.[blast] LIKE '%F21-%' then 'Fase 21'     
							when REPLACE(th.[blast], ' ', '-') LIKE '%ST-%' then 'Stockpile' 
							when REPLACE(th.[blast], '_', '-') LIKE '%ST-%' then 'Stockpile' 
							when th.[blast] = 'Alcaparrosa' then 'Stock Punto B' 
							when th.[blast] = 'Stock Santos' then 'Stock Punto B' 
							else 'Unknown'  
					 end) 
		,[Fase_Banco]=(case 
							when th.[blast] LIKE '%F0-%' then 'Fase 0'   
							when th.[blast] LIKE '%F9-%' then SUBSTRING(th.[blast], 1, NULLIF(CHARINDEX('-', th.[blast], NULLIF(CHARINDEX('-', th.[blast]), 0) + 1), 0) - 1)    
							when th.[blast] LIKE '%F10-%' then SUBSTRING(th.[blast], 1, NULLIF(CHARINDEX('-', th.[blast], NULLIF(CHARINDEX('-', th.[blast]), 0) + 1), 0) - 1)      
							when th.[blast] LIKE '%F11-%' then SUBSTRING(th.[blast], 1, NULLIF(CHARINDEX('-', th.[blast], NULLIF(CHARINDEX('-', th.[blast]), 0) + 1), 0) - 1)       
							when th.[blast] LIKE '%F12-%' then SUBSTRING(th.[blast], 1, NULLIF(CHARINDEX('-', th.[blast], NULLIF(CHARINDEX('-', th.[blast]), 0) + 1), 0) - 1)       
							when th.[blast] LIKE '%F20-%' then SUBSTRING(th.[blast], 1, NULLIF(CHARINDEX('-', th.[blast], NULLIF(CHARINDEX('-', th.[blast]), 0) + 1), 0) - 1)  
							when th.[blast] LIKE '%F21-%' then SUBSTRING([blast], 1, NULLIF(CHARINDEX('-', [blast], NULLIF(CHARINDEX('-', [blast]), 0) + 1), 0) - 1)     
							when REPLACE(th.[blast], ' ', '-') LIKE '%ST-%' then 'Stockpile' 
							when REPLACE(th.[blast], '_', '-') LIKE '%ST-%' then 'Stockpile' 
							when th.[blast] = 'Alcaparrosa' then 'Stock Punto B' 
							when th.[blast] = 'Stock Santos' then 'Stock Punto B' 
							else 'Unknown' 
					 end) 
		
	from ThirstTable th  

)

select * from FourTable ft 
where 0 = 0 
and ft.[Location] <> 'Unknown' 
and ft.[latitud_loads_face] is not null 
and ft.[longitud_loads_face] is not null 
order by ft.DateTimeSplit; 



