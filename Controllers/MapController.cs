using Microsoft.AspNetCore.Mvc;
using WebFog.Models;

namespace WebFog.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MapController : ControllerBase
    {
        private static List<VisitedZone> zones = new List<VisitedZone>();

        [HttpGet]
        public IEnumerable<VisitedZone> GetZones()
        {
            return zones;
        }

        [HttpPost]
        public IActionResult AddZone([FromBody] VisitedZone zone)
        {
            zones.Add(zone);
            return Ok();
        }
    }
}
