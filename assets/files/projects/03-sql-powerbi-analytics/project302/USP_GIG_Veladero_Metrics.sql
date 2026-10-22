ALTER PROCEDURE [dbo].[USP_GIG_Veladero_Metrics]
	 @IDMETRIC INT, 
	 @DATE DATE
AS
BEGIN


	declare @anioActual int
	set @anioActual = year(getdate())
	
	; with _Budget as (
		select  
			(row_number() over(order by Planning_Metric, Planning_Date asc)) as RowId,
			year(Planning_Date) as Anio, month(Planning_Date) as Mes, day(Planning_Date) as Dia, DATEPART(QUARTER, Planning_Date) as [Quarter],
			Planning_Value as Budget_Data_Value, * 
		From [dbo].[GIG_SIP_Budget_Data_Day]
		where year(Planning_Date) = @anioActual
	)
	, Budget_Result as (
		select 
			  Report_Metric
			, Planning_Date
			, Budget_Data_Value
			, CASE Planning_Type WHEN 'AVG' THEN avg(Budget_Data_Value) OVER (partition by Val_id_punto, Anio, Mes  ORDER BY  Planning_Date) 
								 WHEN 'SUM' THEN sum(Budget_Data_Value) OVER (partition by Val_id_punto, Anio, Mes  ORDER BY  Planning_Date) 
				end AS MTD_Budget_Data
			, CASE Planning_Type WHEN 'AVG' THEN avg(Budget_Data_Value) OVER (partition by Val_id_punto ORDER BY  Planning_Date) 
								 WHEN 'SUM' THEN sum(Budget_Data_Value) OVER (partition by Val_id_punto ORDER BY  Planning_Date) 		
				end AS YTD_Budget_Data
			, CASE Planning_Type WHEN 'AVG' THEN avg(Budget_Data_Value) OVER (partition by Planning_Type, [Quarter] ORDER BY RowId) 
								 WHEN 'SUM' THEN sum(Budget_Data_Value) OVER (partition by Planning_Type, [Quarter] ORDER BY RowId)
				end AS QTD_Budget_Data
		
	From _Budget
	where (VAL_ID_PUNTO = @IDMETRIC OR @IDMETRIC = 0)
		and [Quarter] = DATEPART(QUARTER, @DATE) 
		--and exists (select * from _Budget where FORMAT(Planning_Date, 'yyyy-MM-dd') in (@fecha))
	)
	, _Forecast as 
	(
		select  
			(row_number() over(order by Planning_Metric, Planning_Date asc)) as RowId,
			year(Planning_Date) as Anio, month(Planning_Date) as Mes, day(Planning_Date) as Dia, DATEPART(QUARTER, Planning_Date) as [Quarter],
			Planning_Value as Forecast_Data_Value,
			* 
		From  [dbo].[GIG_SIP_Forecast_Data_Day]
		where 0 = 0 
			and year(Planning_Date) = @anioActual
			--and year(Planning_Date) = 2020
	)
	, Forecast_Result as (
		select 
			  Report_Metric
			, Planning_Date
			, Forecast_Data_Value
			, CASE Planning_Type WHEN 'AVG' THEN avg(Forecast_Data_Value) OVER (partition by Val_id_punto, Anio, Mes ORDER BY Planning_Date) 
								 WHEN 'SUM' THEN sum(Forecast_Data_Value) OVER (partition by Val_id_punto, Anio, Mes ORDER BY Planning_Date) 
				end AS MTD_Forecast_Data
			, CASE Planning_Type WHEN 'AVG' THEN avg(Forecast_Data_Value) OVER (partition by Val_id_punto ORDER BY Planning_Date) 
								 WHEN 'SUM' THEN sum(Forecast_Data_Value) OVER (partition by Val_id_punto ORDER BY Planning_Date) 		
				end AS YTD_Forecast_Data
			, CASE Planning_Type WHEN 'AVG' THEN avg(Forecast_Data_Value) OVER (partition by Planning_Type, [Quarter] ORDER BY RowId) 
								 WHEN 'SUM' THEN sum(Forecast_Data_Value) OVER (partition by Planning_Type, [Quarter] ORDER BY RowId)
				end AS QTD_Forecast_Data
		
	From _Forecast 
	where (VAL_ID_PUNTO = @IDMETRIC OR @IDMETRIC = 0)
		and [Quarter] = DATEPART(QUARTER, @DATE) 
		--and exists (select * from _Forecast where FORMAT(Planning_Date, 'yyyy-MM-dd') in (@fecha))
	)

		select 
		*
	from [Budget_Result] br 
	left join [Forecast_Result] fr 
	on br.Report_Metric = fr.[Report_Metric] 

	order by br.Planning_Date

END