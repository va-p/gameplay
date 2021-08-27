import React, { useState, useEffect } from 'react';
import { 
  ImageBackground, 
  Text, 
  View, 
  FlatList, 
  Alert, 
  Share,
  Platform
} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { Fontisto } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import { AppointmentProps } from '../../components/Appointment';
import { Member, MemberProps } from '../../components/Member';
import { ListDivider } from '../../components/ListDivider';
import { Background } from '../../components/Background';
import { ButtonIcon } from '../../components/ButtonIcon';
import { ListHeader } from '../../components/ListHeader';
import { Header } from '../../components/Header';

import BannerImg from '../../assets/banner.png';
import { theme } from '../../global/styles/theme';
import { styles } from './styles';
import { api } from '../../services/api';
import { Load } from '../../components/Load';

type Params = {
  guildSelected: AppointmentProps
}

type GuildWidget = {
  id: string;
  name: string;
  instant_invite: string;
  members: MemberProps[];
  presence_count: number
}

export function AppointmentDetails () {
  const [widget, setWidget] = useState<GuildWidget>({} as GuildWidget);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const { guildSelected } = route.params as Params;

  async function fetchGuildWidget() {
    try {
      const response = await api.get(`/guilds/${guildSelected.guild.id}/widget.json`);
      setWidget(response.data);

    } catch (error) {
      Alert.alert('Verifique as configurações do Servidor. Caso esteja desabilitado, habilite o "Widget" nas configurações.');
    } finally {
      setLoading(false);
    }
  }

  function handleShareInvitation() {
    const message = Platform.OS === 'ios' ? 
    `Junte-se à ${guildSelected.guild.name}`
    : widget.instant_invite;

    Share.share({
      message,
      url: widget.instant_invite
    })
  }

  function handleOpenGuild() {
    Linking.openURL(widget.instant_invite)
  }

  useEffect(() => {
    fetchGuildWidget();
  }, []);
  return  (
      <Background>
        <Header 
          title="Detalhes"
          action={
            guildSelected.guild.owner &&
            <BorderlessButton onPress={handleShareInvitation}>
              <Fontisto 
                  name="share"
                  size={24}
                  color={theme.colors.primary}
              />
            </BorderlessButton>
          }
        />
        <ImageBackground 
          source={BannerImg}
          style={styles.banner}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.title}>
                { guildSelected.guild.name}
            </Text>

            <Text style={styles.subtitle}>
                { guildSelected.description}
            </Text>
          </View>
        </ImageBackground>

        {
          loading ? <Load /> : 
          <>
            <ListHeader 
              title="Jogadores"
              subtitle={`Total ${widget.presence_count}`}
            />

            <FlatList
              data={widget.members}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Member data={item} /> 
              )}
              ItemSeparatorComponent={( ) => <ListDivider isCentered />}
              style={styles.members}
            />
          </>
        }

        {
          guildSelected.guild.owner &&
          <View style={styles.footer}>
            <ButtonIcon 
              title={"Entrar no servidor Discord"} 
              onPress={handleOpenGuild}
            />
          </View>
        }
          
      </Background>
  );
}