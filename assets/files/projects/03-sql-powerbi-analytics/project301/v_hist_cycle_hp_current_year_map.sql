ALTER view [CDPV6].[v_hist_cycle_hp_current_year_map] 
as

with FirstTable 
as( 
	
	select 
	 
		 hd.ShiftId as [shiftindex] 
		,hd.Id as [DumpId] 
		,Loc.[FieldId] as [loc_hist_dumps] 
		,Blast.[FieldId] as [blast]
		,hd.[FieldLsizetons] AS [dumptons]
		
		,hd.[FieldGpsxtkd] as [gpsxtkd]
		,hd.[FieldGpsytkd] as [gpsytkd] 
		
	from [CDPV6].SHIFTShiftdump hd 
	left outer join [CDPV6].[StdShiftLocations] AS Loc with(nolock) ON Loc.Id = hd.FieldLoc
	left outer join [CDPV6].[StdShiftLocations] AS Blast with(nolock) ON Blast.Id = hd.FieldBlast 
	where 0 = 0 
	and floor(hd.ShiftId/10000000) = YEAR(GETDATE())%100 

)
--select * from FirstTable 
,SecondTable as 
(
	
	select 
		
		 ft.shiftindex 
		,hl.Id as LoadLinkId 
		,ft.[loc_hist_dumps]  
		,ft.[blast] 
		,ft.[dumptons] 

		,ft.[gpsxtkd] as [dump_gpsxtkd]
		,ft.[gpsytkd] as [dump_gpsytkd] 
		 
		,Loc.[FieldId] as [digloc_hploads] 

		,hl.[FieldGpsxtkl] as [load_gpsxtkl] 
		,hl.[FieldGpsytkl] as [load_gpsytkl]  

		,Material.[Description] as [MaterialType] 

	from FirstTable ft  
	left join [CDPV6].[SHIFTShiftload] hl with(nolock) ON ft.shiftindex = hl.ShiftId and ft.[DumpId] = hl.FieldDumprec 
	left outer join [CDPV6].[StdShiftLocations] AS Loc with(nolock) ON Loc.Id = hl.FieldLoc 
	INNER JOIN [CDPV6].EnumMaterial AS Material with(nolock) ON Material.Id = hl.FieldLoad 

)
--select * from SecondTable 
,ThirdTable as 
(
	
	select 
		
		 st.shiftindex 
		,(floor(st.shiftindex/1000)+20000000) as [Date_Hist_Dumps] 
		,st.[loc_hist_dumps] 
		,st.[blast] 
		,st.[dumptons] 

		,st.[dump_gpsxtkd]  
		,st.[dump_gpsytkd]  

		,st.[digloc_hploads] 

		,st.[load_gpsxtkl] 
		,st.[load_gpsytkl] 
		,st.[MaterialType]

		,round(avg(hpl.[FieldFacex]), 0) as [facex] 
		,round(avg(hpl.[Fieldfacey]), 0) as [facey] 
		,round(avg(hpl.[Fieldfacez]), 0) as [facez] 

	from SecondTable st  
	left join [CDPV6].[SHIFTShiftbkt] hpl with(nolock) ON hpl.ShiftId = st.shiftindex and hpl.FieldLoadlink = st.LoadLinkId 
	group by st.shiftindex, st.[loc_hist_dumps], st.[blast], st.[dumptons], st.[dump_gpsxtkd], 
		st.[dump_gpsytkd], st.[digloc_hploads], st.[load_gpsxtkl], st.[load_gpsytkl], st.[MaterialType]   

)

select 
	tt.* 
from ThirdTable tt  