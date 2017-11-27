package api;

import java.io.File;
import java.io.StringWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.geotools.geojson.geom.GeometryJSON;

import play.Logger;
import play.vfs.VirtualFile;
import utils.DatabaseUtils;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.io.WKTReader;

public class PointData {
	public static JsonElement getData(double lat, double lon, String seasonFilter, String unitFilter, String subunitFilter, String draw_rateFilter, String hunt_success_rateFilter, String residencyFilter, int legalAnimalFilter, int speciesFilter){
		Connection conn = new DatabaseUtils().getConnection();

		JsonObject hunts = new JsonObject();
		JsonArray huntsArray = new JsonArray();
		String sql = VirtualFile.fromRelativePath("app/sql/getPointData.sql").contentAsString();	
		
		String whereClause = getWhereClause(speciesFilter, seasonFilter,unitFilter,subunitFilter,draw_rateFilter,hunt_success_rateFilter,residencyFilter, legalAnimalFilter);
		sql = sql.replace("$whereClause$", whereClause);
		
		
		try {
			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setDouble(1, lon);
			pstmt.setDouble(2, lat);

			Logger.info(pstmt.toString());
			
			ResultSet rs = pstmt.executeQuery();

			while(rs.next()){
				String huntId =rs.getString(1);
				String species = rs.getString(2);
				double drawRate = rs.getDouble(3);
				double harvestSuccessRate = rs.getDouble(4);
				String residency = rs.getString(5);
				String season = rs.getString(6);
				String legalAnimal = rs.getString(7);
				String unit = rs.getString(8);
				String polygon = rs.getString(9);

				JsonObject hunt = new JsonObject();
				
				JsonObject data = new JsonObject();
				
				
				JsonArray properties = new JsonArray();
				properties.add(labelValue("Species", species));
				properties.add(labelValue("Legal Animal", legalAnimal));
				properties.add(labelValue("Unit", unit));
				properties.add(labelValue("Season", season));
				properties.add(labelValue("Draw Rate", drawRate));
				properties.add(labelValue("Harvest Success Rate", harvestSuccessRate));
				properties.add(labelValue("Residency", residency));
				
				hunt.addProperty("label", huntId);
				hunt.add("properties", properties);
				hunt.add("geometry", getGeometry(polygon));
				data.add("data", hunt);
				huntsArray.add(hunt);
				hunts.add("data", huntsArray);
			}
			
			



		} catch (SQLException e) {
			Logger.error(e, "error in sql");
		} finally {
			try {
				conn.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return hunts;
	}
	
	
	private static String getWhereClause(int species,String season, String unit, String subunit,
			String draw_rate, String hunt_success_rate, String residency, int legalAnimal) {

		String whereClause = "";
		if(species != 0){
			whereClause = whereClause.concat(" and s.id = '"+species+"' ");
		}
		

		if(legalAnimal != 0){
			whereClause = whereClause.concat(" and la.id = '"+legalAnimal+"' ");
		}
		
		
		
		
		
		return whereClause;
	}


	private static JsonElement getGeometry(String polygon) {
		JsonObject obj = new JsonObject();
		WKTReader wktR = new WKTReader();
		
		try {
			Geometry g = wktR.read(polygon);
            StringWriter sw = new StringWriter();
            new GeometryJSON().write(g, sw);
			obj = new JsonParser().parse(sw.toString()).getAsJsonObject();
			
		} catch (Exception e) {
			Logger.error(e,"error in geometry");
		}
		
		
		return obj;
	}


	public static JsonObject labelValue(String label, Object value){
		JsonObject obj = new JsonObject();
		obj.addProperty("label", label);
		if(value instanceof Double){
			try {
				obj.addProperty("value", Double.parseDouble(value.toString()));
			} catch(Exception e){
				obj.addProperty("value", value.toString());

			}
		} else {
			obj.addProperty("value", value.toString());
		}
		return obj;


	}
}
