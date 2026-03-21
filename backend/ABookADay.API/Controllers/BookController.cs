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
        public IEnumerable<Book> GetBooks()
        {
            return _context.Books.ToList();
        }
    }
}