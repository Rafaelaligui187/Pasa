import {
FlatList,
View,
Text,
TouchableOpacity
} from "react-native";

export default function AppsTab({navigation}){

 return(
  <FlatList
   data={installedApps}
   keyExtractor={(item)=>item.id}

   renderItem={({item})=>(
    <TouchableOpacity
      style={{
       padding:18,
       borderBottomWidth:1
      }}
    >
      <Text>
        {item.name}
      </Text>

      <Text>
       {item.package}
      </Text>
    </TouchableOpacity>
   )}
  />
 )
}