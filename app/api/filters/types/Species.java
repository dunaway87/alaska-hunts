package api.filters.types;

import java.sql.Array;
import java.sql.Connection;
import java.sql.ResultSet;

import org.apache.commons.lang.WordUtils;

import play.Logger;

import utils.DatabaseUtils;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class Species extends GenericFilter{
	
	public static class SQL {
		public static String GET_SPECIES = "SELECT DISTINCT s.species, s.id, array_agg(la.id),array_agg(legal_animal)  FROM hunt.species s JOIN hunt.legal_animal la on s.id = species_id GROUP BY s.species, s.id ORDER BY id ASC ";
	}
	
	
	public static JsonElement getFilter(Connection conn) {
		JsonObject filter = new JsonObject();
		filter.addProperty("label", "Species");
		filter.addProperty("parameter", "species");
		filter.addProperty("type", "qualitative");
		filter.addProperty("selector", "or");
		JsonArray range = new JsonArray();
		try{
			ResultSet rs = conn.prepareStatement(SQL.GET_SPECIES).executeQuery();
			while(rs.next()){
				JsonObject item = new JsonObject();
				item.addProperty("label", WordUtils.capitalize(rs.getString(1)));
				item.addProperty("value", rs.getInt(2));
				
				JsonObject subFilter = new JsonObject();
				JsonArray subRange = new JsonArray();
				Array legalIdArray = rs.getArray(3);
				Array legalArray = rs.getArray(4);
				
				ResultSet laIdRS = legalIdArray.getResultSet();
				ResultSet laRS = legalArray.getResultSet();
				while(laIdRS.next()){
					laRS.next();
					JsonObject subItem = new JsonObject();
					subItem.addProperty("label", laRS.getString(2));
					subItem.addProperty("value", laIdRS.getInt(2));
					subRange.add(subItem);
					
				}
				subFilter.addProperty("Label", "Legal Animal");
				subFilter.addProperty("parameter", "legalAnimal");
				subFilter.add("range", subRange);
				item.add("subfilter", subFilter);
				
				range.add(item);
			}
			
			
			
		}catch (Exception e){
			Logger.error(e,"Error getting species filter");
		}
		
		filter.add("range", range);

		return filter;
	}
	
	
	
}
