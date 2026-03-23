using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
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
            [FromQuery] string sortBy = "title")
        {
            page = Math.Max(page, 1);
            pageSize = Math.Max(pageSize, 1);

            var skip = (page - 1) * pageSize;

            IQueryable<Book> query = _context.Books;

            // Keep ordering deterministic so paging does not jump around.
            query = sortBy.ToLowerInvariant() == "id"
                ? query.OrderBy(b => b.BookId)
                : query.OrderBy(b => b.Title).ThenBy(b => b.BookId);

            return query
                .Skip(skip)
                .Take(pageSize)
                .ToList();
        }

        [HttpGet("count")]
        public int GetBookCount()
        {
            return _context.Books.Count();
        }
    }
}