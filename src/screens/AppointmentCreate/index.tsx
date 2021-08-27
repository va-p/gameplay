import React, { useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import uuid from 'react-native-uuid';

import { CategorySelect } from '../../components/CategorySelect';
import { Background } from '../../components/Background';
import { SmallInput } from '../../components/SmallInput';
import { ModalView } from '../../components/ModalView';
import { GuildIcon } from '../../components/GuildIcon';
import { TextArea } from '../../components/TextArea';
import { GuildProps } from '../../components/Guild';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Guilds } from '../Guilds';

import { theme } from '../../global/styles/theme';
import { styles } from './styles';

import { COLLECTION_APPOINTMENTS } from '../../configs/database';

export function AppointmentCreate() {
  const [category, setCategory] = useState('');
  const [openGuildsModal, setOpenGuildsModal] = useState(false);
  const [guild, setGuild] = useState<GuildProps>({} as GuildProps);

  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  function handleOpenGuilds() {
    setOpenGuildsModal(true);
  }

  function handleCloseGuilds() {
    setOpenGuildsModal(false);
  }

  function handleGuildSelect(guildSelect: GuildProps) {
    setGuild(guildSelect);
    setOpenGuildsModal(false);
  }

  function handleCategorySelect(categoryId: string) {
    categoryId === category ? setCategory('') : setCategory(categoryId);
  }

  async function handleSave() {
    const newAppointment = {
      id: uuid.v4(),
      guild,
      category,
      date: `${day}/${month} às ${hour}:${minute}h`,
      description
    };

    const storage = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
    const appointments = storage ? JSON.parse(storage) : [];

    await AsyncStorage.setItem(
      COLLECTION_APPOINTMENTS,
      JSON.stringify([...appointments, newAppointment])
    );

    navigation.navigate('Home');

  }

  return  (
      <KeyboardAwareScrollView 
          style={styles.container}
      >
          <Background>
            <ScrollView>
              <Header
                title="Agendar Partida"
              />

              <Text style={[
                styles.label, 
                { marginLeft: 24, marginTop: 36, marginBottom: 18 }]}
              >
                Categoria
              </Text>

              <CategorySelect
                  categorySelected={category}
                  setCategory={handleCategorySelect}
                  hasCheckBox
              />

              <View style={styles.form}>
                  <RectButton onPress={handleOpenGuilds}>
                    <View style={styles.select}>
                      {
                      guild.icon ? <GuildIcon guildId={guild.id} iconId={guild.icon}/> : <View style={styles.image} />
                      }

                      <View style={styles.selectBody}>
                        <Text style={styles.label}>
                            { 
                            guild.name ? guild.name : "Selecione um servidor" 
                            }
                        </Text>
                      </View>

                      <Feather 
                        name="chevron-right"
                        color={theme.colors.heading}
                        size={18}
                      />
                    </View>
                  </RectButton>

                  <View style={styles.field}>
                    <View>
                      <Text style={[styles.label, {marginBottom: 12 }]}>
                        Dia e mês
                      </Text>

                      <View style={styles.column}>
                        <SmallInput 
                          maxLength={2} 
                          onChangeText={setDay}
                        />
                        <Text style={styles.divider}>
                          /
                        </Text>
                        <SmallInput 
                          maxLength={2}
                          onChangeText={setMonth}
                        />
                      </View>
                    </View>

                    <View>
                      <Text style={[styles.label, {marginBottom: 12 } ]}>
                        Horário
                      </Text>

                      <View style={styles.column}>
                        <SmallInput 
                          maxLength={2} 
                          onChangeText={setHour}
                        />
                        <Text style={styles.divider}>
                          :
                        </Text>
                        <SmallInput 
                          maxLength={2}
                          onChangeText={setMinute}
                        />
                      </View>
                    </View>            
                </View>
              
                <View style={[styles.field, { marginBottom: 12 }]}>
                  <Text style={[styles.label, {marginBottom: 12 } ]}>
                    Descrição
                  </Text>
                  <Text style={styles.caracteresLimit}> 
                    Max 100 caracteres
                  </Text>
                </View>

                <TextArea 
                  multiline
                  maxLength={100}
                  numberOfLines={5}
                  autoCorrect={false}
                  onChangeText={setDescription}
                />

                <View style={styles.footer}>
                  <Button 
                    title="Agendar"
                    onPress={handleSave}
                  />
                </View>            
              </View>
            </ScrollView>

            <ModalView visible={openGuildsModal} closeModal={handleCloseGuilds}>
              <Guilds handleGuildSelect={handleGuildSelect}/>
            </ModalView>
          </Background>
        </KeyboardAwareScrollView>
  );
}