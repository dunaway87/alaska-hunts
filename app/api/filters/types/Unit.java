package api.filters.types;

import java.sql.Array;
import java.sql.Connection;
import java.sql.ResultSet;

import org.apache.commons.lang.WordUtils;

import play.Logger;
import api.filters.types.Residency.SQL;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class Unit {
	public static class SQL {
		public static String GET_UNIT = "SELECT DISTINCT unit, array_agg(distinct subunit order by subunit) FROM hunt.draw_hunt group by unit ORDER BY unit ASC";
	}


	public static JsonElement getUnitFilter(Connection conn) {
		JsonObject filter = new JsonObject();
		filter.addProperty("label", "Unit");
		filter.addProperty("type", "qualitative");
		filter.addProperty("selector", "and");
		JsonArray range = new JsonArray();
		try{
			ResultSet rs = conn.prepareStatement(SQL.GET_UNIT).executeQuery();
			while(rs.next()){
				JsonObject item = new JsonObject();
				item.addProperty("label", rs.getInt(1));
				item.addProperty("value", rs.getInt(1));
				Array legalArray = rs.getArray(2);


				JsonObject subFilter = new JsonObject();
				JsonArray subRange = new JsonArray();
				ResultSet subunitArray = legalArray.getResultSet();
				while(subunitArray.next()){
					if(subunitArray.getString(2) != null){
						JsonObject subItem = new JsonObject();

						subItem.addProperty("label", subunitArray.getString(2));
						subItem.addProperty("value", subunitArray.getString(2));

						subRange.add(subItem);
					}

				}
				if(subRange.size() > 0){
					subFilter.addProperty("Label", "Subunit");
					subFilter.add("range", subRange);
					item.add("subfilter", subFilter);
				}
				range.add(item);
			}



		}catch (Exception e){
			Logger.error(e,"Error getting species filter");
		}

		filter.add("range", range);

		return filter;
	}

}
