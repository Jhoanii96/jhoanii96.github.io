using DocSharp.Markdown;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace VelmanAzureFunction.ConvertToWordFile
{
    public static class ConvertToWordFile
    {
        [Function("ConvertToWordFile")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
            FunctionContext context)
        {
            var log = context.GetLogger("ConvertToWordFile");

            try
            {
                // ------------------------------------------------------------
                // 1. Read Markdown from request body
                // ------------------------------------------------------------
                string markdown = await new StreamReader(req.Body).ReadToEndAsync();

                if (string.IsNullOrWhiteSpace(markdown))
                {
                    return new BadRequestObjectResult("Markdown text is required.");
                }

                // ------------------------------------------------------------
                // 2. Convert Markdown → Word (.docx)
                // ------------------------------------------------------------
                byte[] wordBytes;

                var converter = new MarkdownConverter();
                var markdownSource = MarkdownSource.FromMarkdownString(markdown);

                using (var wordStream = new MemoryStream())
                {
                    converter.ToDocx(markdownSource, wordStream);
                    wordBytes = wordStream.ToArray();
                }

                // ------------------------------------------------------------
                // 3. Return Word file directly
                // ------------------------------------------------------------
                string fileName = $"report-{Guid.NewGuid()}.docx";

                return new FileContentResult(
                    wordBytes,
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                {
                    FileDownloadName = fileName
                };
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Error converting Markdown to Word");

                return new ObjectResult(new
                {
                    error = ex.Message
                })
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
    }
}
