ALTER FUNCTION [dbo].[fn_utm2latlong](@utmx float, @utmy float, @utmzone int, @utmband nvarchar(1))
RETURNS @latlon TABLE (
	latitude float,
	longitude float
) AS
BEGIN

declare @latitude float;
declare @longitude float;

set @utmx = @utmx + 57;
set @utmy = @utmy + 879;

declare @pi float = 3.14159265358979323846; 
declare @sm_a float = 6378137.0; 
declare @sm_b float = 6356752.314; 
declare @UTMScaleFactor float = 0.9996; 

set @utmx = (@utmx - 500000.0) / @UTMScaleFactor;

if (@utmband = 'S') set @utmy = (@utmy - 10000000.0);

set @utmy = @utmy / @UTMScaleFactor;
declare @cmeridian float = (-183.0 + (@utmzone * 6.0)) / 180.0 * @pi;

declare @diflat float = -(29.3555470510924 - 29.3476059290755);
declare @diflon float = -(69.9398297610088 - 69.9391027823632);

declare @n float = (@sm_a - @sm_b) / (@sm_a + @sm_b);
declare @alpha_ float = ((@sm_a + @sm_b) / 2.0) * (1.0 + (power(@n, 2) / 4.0) + (power(@n, 4) / 64.0));
declare @y_ float = @utmy / @alpha_;
declare @beta_ float = (3.0 * @n / 2.0) + (-27.0 * power(@n, 3.0) / 32.0) + (269.0 * power(@n, 5.0) / 512.0);
declare @gamma_ float = (21.0 * power(@n, 2.0) / 16.0) + (-55.0 * power(@n, 4.0) / 32.0);
declare @delta_ float = (151.0 * power(@n, 3.0) / 96.0) + (-417.0 * power(@n, 5.0) / 128.0);
declare @epsilon_ float = (1097.0 * power(@n, 4.0) / 512.0);

declare @phif float = @y_ + (@beta_ * sin(2.0 * @y_)) + (@gamma_ * sin(4.0 * @y_)) + (@delta_ * sin(6.0 * @y_)) + (@epsilon_ * sin(8.0 * @y_));
declare @ep2 float = (power(@sm_a, 2.0) - power(@sm_b, 2.0)) / power(@sm_b, 2.0);
declare @cf float= cos(@phif);
declare @nuf2 float = @ep2 * power(@cf, 2.0);

declare @tf float = tan(@phif); 
declare @tf2 float = @tf * @tf;
declare @tf4 float = @tf2 * @tf2;

declare @Nf float = power(@sm_a, 2.0) / (@sm_b * sqrt(1.0 + @nuf2));
declare @x1frac float = 1.0 / (@Nf * @cf);
declare @Nfpow float = @Nf;
set @Nfpow = @Nfpow * @Nf; 
declare @x2frac float = @tf / (2.0 * @Nfpow);
set @Nfpow = @Nfpow * @Nf;   
declare @x3frac float = 1.0 / (6.0 * @Nfpow * @cf);
set @Nfpow = @Nfpow * @Nf;   
declare @x4frac float = @tf / (24.0 * @Nfpow);
set @Nfpow = @Nfpow * @Nf;   
declare @x5frac float = 1.0 / (120.0 * @Nfpow * @cf);
set @Nfpow = @Nfpow * @Nf;   
declare @x6frac float = @tf / (720.0 * @Nfpow);
set @Nfpow = @Nfpow * @Nf;   
declare @x7frac float = 1.0 / (5040.0 * @Nfpow * @cf);
set @Nfpow = @Nfpow * @Nf;   
declare @x8frac float = @tf / (40320.0 * @Nfpow);

declare @x2poly float = -1.0 - @nuf2;
declare @x3poly float = -1.0 - 2.0 * @tf2 - @nuf2;
declare @x4poly float = 5.0 + 3.0 * @tf2 + 6.0 * @nuf2 - 6.0 * @tf2 * @nuf2 - 3.0 * (@nuf2 * @nuf2) - 9.0 * @tf2 * (@nuf2 * @nuf2);
declare @x5poly float = 5.0 + 28.0 * @tf2 + 24.0 * @tf4 + 6.0 * @nuf2 + 8.0 * @tf2 * @nuf2;
declare @x6poly float = -61.0 - 90.0 * @tf2 - 45.0 * @tf4 - 107.0 * @nuf2 + 162.0 * @tf2 * @nuf2;
declare @x7poly float = -61.0 - 662.0 * @tf2 - 1320.0 * @tf4 - 720.0 * (@tf4 * @tf2);
declare @x8poly float = 1385.0 + 3633.0 * @tf2 + 4095.0 * @tf4 + 1575.0 * (@tf4 * @tf2);

declare @philambda1 float = @phif + @x2frac * @x2poly * (@utmx * @utmx) + @x4frac * @x4poly * power(@utmx, 4.0) + @x6frac * @x6poly * power(@utmx, 6.0) + @x8frac * @x8poly * power(@utmx, 8.0);
set @latitude = (@philambda1 / @pi * 180.0) + @diflat;

declare @philambda2 float = @cmeridian + @x1frac * @utmx + @x3frac * @x3poly * power(@utmx, 3.0) + @x5frac * @x5poly * power(@utmx, 5.0) + @x7frac * @x7poly * power(@utmx, 7.0);
set @longitude = (@philambda2 / @pi * 180.0) + @diflon;

INSERT INTO @latlon VALUES (
	@latitude,
	@longitude
);
RETURN
END