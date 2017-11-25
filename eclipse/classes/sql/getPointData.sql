Select hunt, dh.species, draw_rate, harvest_success_rate, residency, season, dh.legal_animal, full_unit, st_asText(ST_transform(geom, 4326)) from hunt.draw_hunt dh
join hunt.species s on s.species = dh.species
join hunt.legal_animal la on la.legal_animal = dh.legal_animal and la.species = dh.species


where st_contains(geom, st_transform(ST_SetSrid(ST_Point(?,?),4326),3338)) $whereClause$ order by hunt desc
