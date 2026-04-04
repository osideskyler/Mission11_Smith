using Microsoft.AspNetCore.Mvc;
using ABookADay.API.Data;
using Microsoft.EntityFrameworkCore;

namespace ABookADay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BookController(BookDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Book> GetBooks(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10, 
            [FromQuery] string sortBy = "title",
            [FromQuery] List<string>? categories = null)
        {
            page = Math.Max(page, 1);
            pageSize = Math.Max(pageSize, 1);

            var skip = (page - 1) * pageSize;

            IQueryable<Book> query = _context.Books.AsQueryable();
            if (categories != null && categories.Count > 0)
            {
                query = query.Where(b => categories.Contains(b.Category));
            }

            // Stable ordering for deterministic paging.
            if (string.Equals(sortBy, "id", StringComparison.OrdinalIgnoreCase))
            {
                query = query.OrderBy(b => b.BookId);
            }
            else
            {
                query = query.OrderBy(b => b.Title).ThenBy(b => b.BookId);
            }

            return query
                .Skip(skip)
                .Take(pageSize)
                .ToList();
        }

        [HttpGet("count")]
        public int GetBookCount([FromQuery] List<string>? categories = null)
        {
            IQueryable<Book> query = _context.Books.AsQueryable();
            if (categories != null && categories.Count > 0)
            {
                query = query.Where(b => categories.Contains(b.Category));
            }
            return query.Count();
        }

        [HttpGet("types")]
        public IActionResult GetBookTypes()
        {
            var bookTypes = _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();
            return Ok(bookTypes);
        }

        [HttpPost]
        public async Task<ActionResult<Book>> CreateBook([FromBody] Book book)
        {
            book.BookId = 0;
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return Created($"/api/Book/{book.BookId}", book);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] Book book)
        {
            var existing = await _context.Books.FindAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            existing.Title = book.Title;
            existing.Author = book.Author;
            existing.Publisher = book.Publisher;
            existing.ISBN = book.ISBN;
            existing.Classification = book.Classification;
            existing.Category = book.Category;
            existing.PageCount = book.PageCount;
            existing.Price = book.Price;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}