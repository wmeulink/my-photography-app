using ElliottPhotography.Data;
using ElliottPhotography.Models;
using Microsoft.AspNetCore.Mvc;

namespace ElliottPhotography.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PhotosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Photo>> GetPhotos()
        {
            return Ok(_context.Photos.ToList());
        }

        [HttpPost]
        public ActionResult<Photo> AddPhoto(Photo photo)
        {
            _context.Photos.Add(photo);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetPhotos), new { id = photo.Id }, photo);
        }
    }
}
