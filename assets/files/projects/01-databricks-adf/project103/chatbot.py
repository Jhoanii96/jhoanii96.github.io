# ---------------------------
# Send & display
# ---------------------------
if prompt and prompt.strip():  # Check for non-empty prompt
    # Add user message to session state
    st.session_state.messages.append({"type": "user", "content": prompt, "data": pd.DataFrame()})
    
    # Display user message
    col1, col2 = st.columns([0.3, 0.7])
    with col2:
        with st.chat_message("user"):
            st.write(prompt)

    # Display assistant response
    col1, col2 = st.columns([0.7, 0.3])
    with col1:
        with st.status("Contacting Genie…", expanded=False) as status:
            try:
                # Initialize response variables
                response = None
                text_result = None
                query_object = None
                data = None
                df = pd.DataFrame()
                content = ""
                
                # Get response from Genie
                if st.session_state.conversation_id is None:
                    response = w.genie.start_conversation_and_wait(
                        space_id=SPACE_ID, 
                        content=prompt
                    )
                    st.session_state.conversation_id = response.conversation_id
                else:
                    response = w.genie.create_message_and_wait(
                        space_id=SPACE_ID,
                        conversation_id=st.session_state.conversation_id,
                        content=prompt
                    )
                
                # Validate response
                if not response or not hasattr(response, 'attachments'):
                    raise ValueError("Invalid response from Genie API")
                
                # Process attachments
                if response.attachments:
                    attachments_object = response.attachments[0]
                    
                    # Extract text content
                    if hasattr(attachments_object, 'text') and attachments_object.text:
                        text_result = attachments_object.text
                        content = text_result.content if hasattr(text_result, 'content') else ""
                    
                    # Extract and execute query if present
                    if hasattr(attachments_object, 'query'):
                        query_object = attachments_object.query
                        
                        if query_object and hasattr(query_object, 'query'):
                            full_query = query_object.query
                            if full_query and full_query.strip():
                                data = w.statement_execution.execute_statement(
                                    warehouse_id=WAREHOUSE_ID, 
                                    statement=full_query
                                )
                
                status.update(label="Genie responded", state="complete", expanded=True)
                
                # Display assistant response
                with st.chat_message("assistant"):
                    if content:
                        st.write(content)
                    
                    # Display data if available
                    if query_object and data and hasattr(data, 'result'):
                        try:
                            if (hasattr(data, 'manifest') and 
                                hasattr(data.manifest, 'schema') and 
                                hasattr(data.manifest.schema, 'columns')):
                                
                                columns = [item.name for item in data.manifest.schema.columns]
                                
                                if (hasattr(data, 'result') and 
                                    hasattr(data.result, 'data_array') and 
                                    data.result.data_array):
                                    
                                    data_array = data.result.data_array
                                    df = pd.DataFrame(data_array, columns=columns)
                                    st.dataframe(df)
                                else:
                                    st.info("No data returned from query")
                            else:
                                st.warning("Invalid data structure in response")
                        except Exception as df_error:
                            st.error(f"Error processing data: {df_error}")
                
                # Add assistant response to session state
                st.session_state.messages.append({
                    "type": "assistant", 
                    "content": content, 
                    "data": df
                })
                
            except Exception as e:
                status.update(label="Request failed", state="error", expanded=True)
                error_msg = f"Error talking to Genie: {str(e)}"
                st.error(error_msg)
                
                # Log the error for debugging (optional)
                print(f"Genie API Error: {error_msg}")
                
                # Add error message to session state
                st.session_state.messages.append({
                    "type": "assistant", 
                    "content": f"Sorry, I encountered an error: {str(e)}", 
                    "data": pd.DataFrame()
                })

